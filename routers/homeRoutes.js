const express = require('express')
const app = express();
const Campground = require('../models/campground')
const { reviewJoi } = require('../errorUtils/schemas')
const Review = require('../models/review');
const AppError = require('../errorUtils/AppError');
const catchAsync = require('../errorUtils/catchAsync')
const Routes = express.Router();


Routes.get('',(req, res) => {
    res.render('home', { who: ' Home' })
})

Routes.get('/contact', (req,res) =>{
    res.render('contact', {who: 'contact'})
})


module.exports= Routes