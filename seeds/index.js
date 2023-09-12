const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors} = require('./seedHelpers');
const desc = require('./desc')
const Campground = require('../models/campground');
const Review = require('../models/review');
const User = require('../models/user');
mongoose.connect('mongodb+srv://Tmony:Tmony408@cluster0.vgbnriv.mongodb.net/?retryWrites=true&w=majority');

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
   const user= await User.find({});
    for (let i = 0; i < 400; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [{
                fileName: 'Yelp-Camp/edjkcbimogomzooj3j34',
                filePath: 'https://res.cloudinary.com/dqggjx029/image/upload/v1694486266/Yelp-Camp/edjkcbimogomzooj3j34.jpg'
            },{
                fileName: 'Yelp-Camp/fkwp1jp6qaa722ysyjc2',
                filePath: 'https://res.cloudinary.com/dqggjx029/image/upload/v1694486266/Yelp-Camp/fkwp1jp6qaa722ysyjc2.jpg'
            }]
            ,
            price: Math.floor(Math.random() * 50),
            description: sample(desc),
            author: sample(user)._id,
            geometry:{type:"Point",coordinates:[cities[random1000].longitude,cities[random1000].latitude]}
        })
        await camp.save();
    }
}

// seedDB().then(() => {
//     mongoose.connection.close();
// })

seedDB().then(() => {
    db.close();
    console.log('dsconnected'.toLowerCase())
});