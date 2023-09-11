const passport= require('passport')
const Campground = require('./models/campground')
const {campJoi, reviewJoi} = require('./errorUtils/schemas')
const AppError = require('./errorUtils/AppError')
module.exports.loginAuth = passport.authenticate('local',{failureFlash:true, failureRedirect:'/login',keepSessionInfo: true})
module.exports.isLoggedin= (req,res,next)=>{
    if(! req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl
        req.flash('error', 'You have to login first')
        return res.redirect('/login')


    }
    next()
}
module.exports.preventLogin = (req,res,next)=>{
    if(req.isAuthenticated()){
        return res.redirect('/campgrounds')
    }
    next()
}
module.exports.validateCamp= (req, res, next) => {
    const { error } = campJoi.validate(req.body);
    if (error) {
        const message = error.details.map(el => el.message).join(',');
        throw new AppError(message, 400)
        req.flash('error', message)
        res.redirect('')
    } else {
        next();
    }
}
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewJoi.validate(req.body);
    if (error) {
        const message = error.details.map(el => el.message).join(',');
        throw new AppError(message, 400)
    } else {
        next();
    }
}
module.exports.existsAndIsAuthor = async(req,res,next)=>{
    const { id } = req.params
    const campGround = await Campground.findById(id);
    if(!campGround){
        req.flash('error', 'Cannot find campground')
        return res.redirect('/campgrounds')
    }
    if(!campGround.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to edit this campground')
        return res.redirect('/campgrounds/'+id)
    }
    next()
}
module.exports.reviewOnce = async(req,res,next)=>{
    const {id}= req.params
    const campGround = await Campground.findById(id).populate({path: 'reviews', populate:{path:'author'}})
   for(let review of campGround.reviews ){
       if (review.author.equals(req.user)){
        req.flash('you have posted your review before')
        return res.redirect('campgrounds/'+ id)
       }else{
        continue
       }
   }
   next()
}
