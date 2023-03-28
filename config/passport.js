const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
//Require your User Model here!
const UserModel = require('../models/user');

// configuring Passport!
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK
},
  async function (accessToken, refreshToken, profile, cb) {
    // a user has logged in via OAuth!
    // refer to the lesson plan from earlier today in order to set this up
    // this function occurs after a user has logged in via OAUTH



    try {
      // Check if the user is in the database
      // Has the user logged in before?
      let user = await UserModel.findOne({ googleId: profile.id });
      // if the UserModel doesn't find anything 
      // user variable is undefined, its not an error
      if (user) return cb(null, user);
      // ====================================================
      // Below here means the user has never logged in before
      // ====================================================
      // one line version above, multiple line version below
      // if(user){
      // 	return cb(null, user)
      // }
      // cb is function that passes information to the next piece
      // of middleware, signature cb(error, informationYouWantToPass)


      // if the user hasn't logged in before 
      // Create the User in the database

      user = await UserModel.create({
        name: profile.displayName,
        googleId: profile.id,  // <- For your project your must store the googleId
        email: profile.emails[0].value,
        avatar: profile.photos[0].value
      })
      // pass thier information to the next piece of middleware
      cb(null, user)


    } catch (err) {
      cb(err)
    }
  })
)

// This method will be called after the verify callback when the user logs in
// its argument will accept the cb(null, user) <- user document from the above function
passport.serializeUser(function (user, cb) {
  cb(null, user._id); // <- this adds the user._id to our session cookie! Remember the session cookies is what is sent back 
  // and forth from the browser to identify who is making http requests to our server
});

// This method is called every time an http request comes from an existing user that is logged in 
// opens the session cookie, grabs the id of the user, searches the database for the user, 
// and then assigns that user document to req.user, which will availible in every single CONTROLLER function in your app
passport.deserializeUser(function (userId, cb) {
  UserModel.findById(userId)
    .then(function (userDoc) {
      cb(null, userDoc);  //<- this line is what assigns the userDoc to req.user, so essentially req.user = userDoc
      // passes the request to our controller now
    }).catch(err => {
      cb(err)
    })
})
