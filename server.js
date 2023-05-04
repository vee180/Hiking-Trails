// load the env consts
require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
//import near the top of the file
const MongoStore = require("connect-mongo");

// session middleware
const session = require("express-session");
const passport = require("passport");
const methodOverride = require("method-override");
const indexRoutes = require("./routes/index");

//import near the top of the file

// rest of code then update the middleware
// setting up our session to use the Mongostore

const indexRouter = require("./routes/index");
const trailsRouter = require("./routes/trails");
const reviewsRouter = require("./routes/reviews");

// create the Express app
const app = express();

// connect to the MongoDB with mongoose

// require database file
// this will create a connection
// from our server.js (localhost:3000) -> Mongodb localhost:27017
require("./config/database");
require("./config/passport"); // <- setups up passport functions
// Since we are not exporting anything from the database file,
// no need to save it to a constiable

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// The point of the sessions cookie is so we can keep track of what client is making
// http requests to the server
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.DATABASE_URL,
    }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// PASSPORT MUST BE ADDED AFTER THE SESSION, because it USES
// THE SESSION COOKIE TO STORE THE LOGGED IN USERS ID
app.use(passport.initialize());
app.use(passport.session());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method")); // <- this needs to be added for PUT And DELETE request that are in the
// query strings from the client http requests /?_method=DELETE

// this custom middlware needs to be after passport!
// =================================================
// =================================================
// =================================================
// THIS code means you never have to pass req.user in your controller functions in the render!
// to inject user into the your ejs template
// THis is super useful project so Read these comments!
app.use(function (req, res, next) {
  res.locals.user = req.user; // req.user, is from the cleint
  // it will be a user document or undefined (not logged in)

  // res.locals, is an object that is passed into EVERY SINGLE EJS PAGE IN YOUR VIEWS FOLDER
  // and it will pass a user object into it which will be the user document or undefined (if not logged in)
  // whatever key you attach to res.locals is avialable in every ejs file!
  next();
});
// =================================================
// =================================================
// =================================================

app.use("/", indexRouter);
app.use("/trails", trailsRouter);


// Embedded Resources (Reviews)
// One to many relationship
// are always mounted as just `/`
// because none of the routes start with the same
// common path like `/movies`
app.use("/", reviewsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
