const Campground = require('../models/campground')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })


const { cloudinary } = require('../cloudinary/index')


module.exports.viewAllCampgrounds = async (req, res) => {
    const title = req.query.title || ''
    const keywords = req.query.keywords || ''
    const country = req.query.country || ''
    const price = req.query.price || 1000
    const campGrounds = await (await Campground.find({
        title: { $regex: title, $options: "i" },
        description: { $regex: keywords, $options: "i" },
        location: { $regex: country, $options: "i" },
    }).
        where('price').
        lte(price))


    for (let campGround of campGrounds) {
        campGround.description = campGround.description.slice(0, 100) + '...'
    }
    // console.log(req.user)
    res.render('campgrounds/index', { campGrounds, who: 'All Campgrounds' })
}


module.exports.showCampground = async (req, res) => {
    const { id } = req.params
    const campGround = await Campground.findById(id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('author');
    if (!campGround) {
        req.flash('error', 'Cannot find campground')
        return res.redirect('/campgrounds')
    }
    let hasPosted = false
    let sumRating = 0
    let rep = 0
    for (let review of campGround.reviews) {
        sumRating += review.rating
        rep++
        if (review.author.equals(req.user)) {
            hasPosted = true

        } else {
            continue
        }
    }
    averageRating = Math.floor(sumRating / rep)
    res.render('campgrounds/show', { campGround, eReview: false, hasPosted, averageRating, who: campGround.title })
}

module.exports.createCampground = async (req, res) => {
    const { title, location } = req.body;
    const geoData = await geocoder.forwardGeocode({
        query: location,
        limit: 1
    }).send()

    campGround = new Campground(req.body);
    campGround.geometry = geoData.body.features[0].geometry
    campGround.images = req.files.map(f => ({ fileName: f.filename, filePath: f.path }))
    campGround.author = req.user._id
    await campGround.save();

    req.flash('success', 'Successfully created a new campground')
    console.log(campGround)
    res.redirect('/campgrounds')
}
module.exports.editCampgroundForm = async (req, res) => {
    const { id } = req.params
    const campGround = await Campground.findById(id);
    res.render('campgrounds/edit', { campGround, who: campGround.title })
}
module.exports.editCampground = async (req, res) => {
    const { id } = req.params
    const { title, location } = req.body;
    const geoData = await geocoder.forwardGeocode({
        query: location,
        limit: 1
    }).send()

    const campGround = await Campground.findByIdAndUpdate(id, req.body, { runValidators: true });
    campGround.geometry = geoData.body.features[0].geometry
    imgs = req.files.map(f => ({ fileName: f.filename, filePath: f.path }))
    campGround.images.push(...imgs)
    await campGround.save()
    if (req.body.deleteImages) {
        for (let fileName of req.body.deleteImages) {
            await cloudinary.uploader.destroy(fileName)
        }
        await campGround.updateOne({ $pull: { images: { fileName: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated campground')
    res.redirect('/campgrounds/' + id);
}
module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findOneAndDelete({ _id: id });
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/campgrounds')
}