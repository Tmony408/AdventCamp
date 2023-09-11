const express = require('express')
const User = require('../models/user')
const app = express()
const Routes = express.Router({ mergeParams: true });
const catchAsync = require('../errorUtils/catchAsync')
const passport = require('passport')
const { loginAuth, preventLogin } = require('../middlewares');
const flash = require('express-flash');
const userControllers = require('../controllers/user')


// googleauth
require('../services/google-auth')


Routes.get('/auth/google', preventLogin,
    passport.authenticate('google', {
        scope: 
            ['email', 'profile']
    }
    ));

Routes.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/register',
        failureFlash: true,
        successFlash: "Successfully logged in!",
    }));

// google end 
// =======================================================================================



// facebook start 
// require('../services/facebook-auth')



// Routes.get('/auth/facebook',
//   passport.authenticate('facebook'));

// Routes.get('/auth/facebook/callback',
//   passport.authenticate('facebook', { failureRedirect: '/login' }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/');
//   });



// facebook end 
//   =================================================================================================


// git start 
// require('../services/github-auth')


// Routes.get('/auth/github',
//   passport.authenticate('github', { scope: [ 'user:email' ] }));

// Routes.get('/auth/github/callback', 
//   passport.authenticate('github', { failureRedirect: '/login' }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/');
//   });






// git end 
// ====================================================================================================

Routes.get('/register', (req, res) => {
    res.render('user/register', { who: 'Register' })
})
Routes.get('/login', preventLogin, (req, res) => {
    res.render('user/login', { who: 'login' })
})

Routes.get('/logout', userControllers.logoutUser)

Routes.post('/register-new', preventLogin, catchAsync(userControllers.createUser))

 
Routes.post('/login', preventLogin, loginAuth, catchAsync(userControllers.loginUser))

module.exports = Routes