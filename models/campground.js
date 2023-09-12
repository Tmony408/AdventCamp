const mongoose = require('mongoose');
const Review = require('./review');
const User = require('./user');
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } };

const ImageSchema = new Schema(
    {
        fileName: String,
        filePath:String
    },opts
);
ImageSchema.virtual('thumbnail').get(function(){
    return this.filePath.replace('/upload' , '/upload/w_200')
});
ImageSchema.virtual('display').get(function(){
    return this.filePath.replace('/upload' , '/upload/w_1920,h_1280,b_black,c_pad')
})

const campgroundSchema = new Schema({
    title: { type: String, required: true },
    price: Number,
    description: String,
    location: String,
    geometry:  {
        type: {
            type: String, 
            enum: ['Point'], 
            required: true
          },
          coordinates: {
            type: [Number],
            required: true
          }
    },
    images: [ImageSchema],
    author:{
        type:Schema.Types.ObjectId,
        ref : 'User' 
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    createdDate:{
        type: Date,
        immutable: true,
        default: ()=> Date.now()
    },
    updatedDate: {
        type:Date,
        default: () => Date.now()
    }
}, opts)

campgroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `<a style="text-decoration: none;" href="/campgrounds/${this._id}"> <img  src="${this.images[0].thumbnail}" alt="Campground image">
    <strong><p style="color: black; margin: 0px" >${this.title}</p></strong></a>
    <p style="color: black;margin: 0px" >${this.description.substring(0,30)}...</p><strong><p style="color: black;" >${this.location}.</p></strong></a>`
})
campgroundSchema.pre('save', function(next){
    this.updatedDate = Date.now()
    next(); 
})
campgroundSchema.post('findOneAndDelete', async function (doc) {
    console.log(doc)
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})
const Campground = mongoose.model('Campground', campgroundSchema)
module.exports = Campground