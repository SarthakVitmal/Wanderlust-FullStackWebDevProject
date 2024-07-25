if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const session = require('express-session');
const MongoStore = require('connect-mongo')
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');
const cookieParser = require('cookie-parser')
const port = 8080;

const dbUrl = process.env.ATLASDB_URL;

const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter: 24 * 3600,
})

const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie : {
        expires : Date.now() + 1000 * 60 * 60 * 24 *  7,
        maxAge : 1000 * 60 * 60 * 24 * 7,
        httpOnly : true,
    }
};

store.on("error",()=>{
    console.log("Error in MONGO SESSION STORE ",error);
})


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejsMate);
app.use(express.json());
app.use(cookieParser());
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
});
// const Mongo_Url = "mongodb://127.0.0.1:27017/wanderlust";
main()
    .then(() => {
        console.log("Connection to DB Successful");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
     mongoose.connect(dbUrl);
}

const listingsRouter = require('./routes/listing.js')
const reviewsRouter = require('./routes/review.js')
const userRouter = require('./routes/user.js');
const { error } = require('console');
app.use('/listings',listingsRouter);
app.use('/listings/:id/reviews',reviewsRouter);
app.use('/',userRouter);

// app.get("/", (req, res) => {
//     res.send("Go to /listings");
// });

app.use((err, req, res, next) => {
    console.log(err);
    next(err);
});

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render('error.ejs', { message });
});

app.listen(port, () => {
    console.log(`listening to port ${port}`);
});
