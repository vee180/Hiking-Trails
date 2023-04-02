var express = require("express");
var router = express.Router();
const passport = require("passport");

// The root route renders our only view
router.get("/", function (req, res, next) {
  res.render("index");
  //UPDATE THIS
  // Where do you want to go for the root route
  // in the student demo this was res.redirect('/trails'), what do you want?
  // This could be a landing page, or just redirect to your main resource page which you'll have an a tag that makes
  // a request to `/auth/google` route below
});

// Google OAuth login route
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback route
router.get(
  "/oauth2callback",
  passport.authenticate("google", {
    successRedirect: "/trails",
    failureRedirect: "/trails",
  })
);

// OAuth logout route
router.get("/logout", function (req, res) {
  req.logout(function () {
    //< - req.logout comes from passport, and what it does is destorys the cookie keeping track of the user!
    res.redirect("/");
  });
});

module.exports = router;
