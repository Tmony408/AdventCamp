const mongoose = require('mongoose');
const pLMongoose = require('passport-local-mongoose')
const Schema = mongoose.Schema;
const {isEmail} = require('validator')





const userSchema = new Schema({
    email :{
        type:String,
        required:[ true,'Please enter an email'],
        unique: [true, "email already registered"] ,
    },
    fullName: {
        type: String,
        required: true
    },
    createdDate:{
        type: Date,
        immutable: true,
        default: ()=> Date.now()
    },
    updatedDate: {
        type:Date,
        default: () => Date.now()
    },
    source: {
        type: String,
        required: [true, 'source not specified']
    },
    username: {
        type: String,
        required: [true, 'Please enter your username']
    }
})

userSchema.plugin(pLMongoose, {usernameQueryFields: ["email"]});
module.exports = mongoose.model('User', userSchema)