
const mongoose = require('mongoose');
const User = require('./user')
const Schema = mongoose.Schema;
const reviewSchema = new Schema({
    body: {
        type: String, required: true
    }, rating: {
        type: Number, required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    createdDate:{
        type: Date,
        immutable: true,
        default: ()=> Date.now()
    },
    updatedDate: {
        type:Date,
        default: () => Date.now()
    } 
});

const Review = mongoose.model('Review', reviewSchema)
module.exports = Review