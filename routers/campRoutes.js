const express = require('express')
const app = express();
const Campground = require('../models/campground')
const AppError = require('../errorUtils/AppError');
const catchAsync = require('../errorUtils/catchAsync')
const Routes = express.Router({ mergeParams: true });
const Review = require('../models/review');
const { isLoggedin } = require('../middlewares')
const User = require('../models/user')
const { validateCamp, validateReview, existsAndIsAuthor,reviewOnce } = require('../middlewares')
const campgroundControllers = require('../controllers/campgrounds')
const reviewControllers = require('../controllers/reviews.js')
const multer  = require('multer')
const {storage} = require('../cloudinary/index')
const upload = multer({ storage })








Routes.get('', catchAsync(campgroundControllers.viewAllCampgrounds))
Routes.get('/new', isLoggedin, (req, res) => {
    res.render('campgrounds/new', { who: 'Add Campgound' })
});
Routes.get('/:id', catchAsync(campgroundControllers.showCampground))
Routes.get('/:id/edit', isLoggedin, existsAndIsAuthor, catchAsync(campgroundControllers.editCampgroundForm));
Routes.get('/:id/review/:reviewId', isLoggedin, catchAsync(reviewControllers.reviewEditForm))
Routes.post('', isLoggedin,upload.array('images',8), validateCamp, catchAsync(campgroundControllers.createCampground))
Routes.post('/:id/new-review', isLoggedin,reviewOnce, validateReview, catchAsync(reviewControllers.createReview))


Routes.put('/:id', isLoggedin, existsAndIsAuthor,upload.array('images', 8), validateCamp, catchAsync(campgroundControllers.editCampground))

Routes.put('/:id/review/:reviewId', isLoggedin, validateReview, catchAsync(reviewControllers.editReview))
Routes.delete('/:id', isLoggedin,existsAndIsAuthor, catchAsync(campgroundControllers.deleteCampground))
Routes.delete('/:id/reviews/:reviewId', isLoggedin, catchAsync(reviewControllers.deleteReview))


module.exports = Routes;