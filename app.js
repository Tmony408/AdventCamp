
// Requires
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}


const express = require('express')
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground')
const methodOverride = require('method-override');
const { forEach } = require('./seeds/cities');
const AppError = require('./errorUtils/AppError');
const catchAsync = require('./errorUtils/catchAsync')
const Review = require('./models/review');
const campRoutes = require('./routers/campRoutes')
const session = require('express-session')
const ejsMate = require('ejs-mate')
const flash = require('express-flash')
const passport= require('passport')
const LocalStrategy= require('passport-local')
const User = require('./models/user')
const userRoutes = require('./routers/userRoutes')
const homeRoutes = require('./routers/homeRoutes')
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp'
const MongoStore = require('connect-mongo');
// =============================================================================================
//==============================================================================================



// 'mongodb://localhost:27017/yelp-camp' 
// mongoose set up here
mongoose.connect(dbUrl); 

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

// =============================================================================================
//==============================================================================================


// middlewares for display
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))

// =============================================================================================
//==============================================================================================

// middleware for routes body
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));
// mongoose sanitize for query security 
app.use(mongoSanitize());
// =============================================================================================
//==============================================================================================
const secret = process.env.SECRET || 'this is my first session'
// mongodb store session 
const store = MongoStore.create({
    mongoUrl: dbUrl ,
    touchAfter: 24 * 3600, // time period in seconds
    crypto: {
        secret
    }
  })
  store.on("error", function(e){
    console.log('session store error')
  })
// Session and flash
const sessionConfig= {
    store,
    name: 'mapsload',
    secret ,
    resave: true,
    saveUninitialized: true,
    cookieName:'session',
    cookie:{
        httpOnly: true,
        expires: Date.now + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}
  app.use(cookieParser())
app.use(session(sessionConfig))
app.use(flash());

// =============================================================================================
//==============================================================================================
// helmet security
app.use(
    helmet({
      contentSecurityPolicy: false
    })
  );
//   =========================================================================================================

// Passport middleware

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
// =============================================================================================
//==============================================================================================



//exists in all templates
app.use((req,res,next) =>{
    res.locals.success =req.flash('success')
    res.locals.error =req.flash('error')
    res.locals.currentUser = req.user
    
    next()
})

//================================================================================================
//===================================================================================================

//     throw new Error('e shock you');
// })
// const validateCamp = (req, res, next) => {
//     const { error } = campJoi.validate(req.body);
//     if (error) {
//         const message = error.details.map(el => el.message).join(',');
//         throw new AppError(message, 400)
//     } else {
//         next();
//     }
// }



// Routes

app.use('', userRoutes)
app.use('', homeRoutes);
app.use('/campgrounds', campRoutes)

// =============================================================================================
//==============================================================================================



// Error handlers
app.use((req, res) => {
    res.render('pages-error-404', { who: ' Error' })

})

app.use((err, req, res, next) => {
    const { status = 500, message } = err;
    if (!err.message) {
        err.message('problem no dey finish')
    }
    res.status(status).render('error', { status, message, who: 'Error' });
})
// =============================================================================================
//==============================================================================================

const port =  process.env.PORT || 3000


app.listen(port, () => {
    console.log('port '+ port)
})