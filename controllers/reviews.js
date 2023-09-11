const Review = require('../models/review')
const Campground = require('../models/campground')

module.exports.createReview = async (req, res) => {
    const { id } = req.params
    const review = new Review(req.body)
    const campGround = await Campground.findById(id);
    review.author= req.user._id
    campGround.reviews.push(review);
    await campGround.save()
    await review.save();
    req.flash('success', 'Successfully added review')

    res.redirect('/campgrounds/' + id)
}

module.exports.reviewEditForm = async (req, res) => {
    const { id, reviewId } = req.params
    const campGround = await Campground.findById(id).populate('reviews').populate('author');
    const eReview = await Review.findById(reviewId)

    if (!campGround) {
        req.flash('error', 'Cannot find campground')
       return res.redirect('/campgrounds')
    }
    if(eReview){
        let sumRating,rep =0
    for(let review of campGround.reviews ){
        sumRating += review.rating
        rep++
    }
    averageRating = Math.floor(sumRating/rep)
       return res.render('campgrounds/show', { campGround,eReview,averageRating, who: campGround.title })
    }
   res.redirect('/campgrounds/'+ id)
}

module.exports.editReview = async (req, res) => {
    const { id, reviewId } = req.params
    const review = await Review.findByIdAndUpdate(reviewId, req.body, { runValidators: true });
    review.updatedDate = Date.now()
    review.save()
    req.flash('success', 'Successfully updated review')
    res.redirect('/campgrounds/' + id);
}
module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: { $in: reviewId } } }, { new: true });
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Successfully deleted a review')
    res.redirect('/campgrounds/' + id)
}