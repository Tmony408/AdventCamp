const passport = require('passport')
const User = require('../models/user')

const GoogleStrategy = require('passport-google-oauth20').Strategy;

let newUser = {}
let existingUser = {}

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
},
  async function (accessToken, refreshToken, profile, email, done) {
    try {
      const prevUser = await User.findOne({ email:email.emails[0].value })
      if (!prevUser) {
        const newUser = await new User({
          email: email.emails[0].value,
          username: email.id,
          fullName: email.displayName,
          source: 'google',
  
        })
        newUser.save()
        return done(null, newUser)
      }
      if (prevUser.source != 'google') {
        return done(null, false, { message: `You have previously signed up with a different signing method` })
      }
  
      return done(null, prevUser);
      
    } catch (error) { 
      return  console.log(error)
    }

  //  return console.log(typeof email.emails[0].value,typeof email.id,typeof email.displayName,)
  }))

//  console.log (email.emails[0].value)

passport.serializeUser((user, done) => {
  done(null, user)
})
passport.deserializeUser((user, done) => {
  done(null, user)
})