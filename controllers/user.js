const User = require('../models/user')
const Campground = require('../models/campground')
const flash = require('express-flash');
const AppError = require('../errorUtils/AppError')
const{isEmail} = require('validator')

module.exports.logoutUser = (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('success', 'Logout successful')
        res.redirect('/campgrounds')
    })
} 
module.exports.createUser = async (req, res,) => {
    try {
        previousUser = await User.find({})
        const { username, password, fullName, email } = req.body
        console.log(isEmail(email))
        if (!isEmail(email)){
            throw new AppError('Your email is not valid', 400)
        }
       
        for(let user of previousUser ){
            
            if (username === user.username){
                req.flash('error', 'This username has been used')
                return res.redirect('/register')
                res.redirect('/register')
            }
        }
      
        const user = new User({ email, username, fullName , source: 'local'})
        const newUser = await User.register(user, password)
        await newUser.save();
        req.login(newUser, err => {
            if (err) { return next(err) }

            req.flash('success', 'Successfully created a new User');
            res.redirect('/campgrounds');


        })

    } catch (error) {
        if (error.code === 11000) {

            req.flash('error', 'This Email has been used')
        } else {
            req.flash('error', message)

        }
        res.redirect('/register')
    }

    

}
module.exports.loginUser = async (req, res) => {
    req.flash('success', 'Sucessfully logged in')
    const redirectUrl = req.session.redirectUrl
    link = redirectUrl || '/campgrounds'
    delete req.session.redirectUrl;
    res.redirect(link)

}