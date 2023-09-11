const passport = require('passport')
const User = require('../models/user')
const GitHubStrategy = require('passport-github2').Strategy;



passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.envGITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
  console.log(profile)
  }
));