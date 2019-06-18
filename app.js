const express = require('express'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    mongoose = require('mongoose'),
    methodOverride = require("method-override"),
    User = require('./models/user'),
    flash = require("connect-flash"),
    campRoutes = require("./routes/camps"),
    commentRoutes = require("./routes/comments"),
    indexRoutes = require("./routes/index"),
    app = express();
// seedDB = require("./seed")();

/* Mongoose is a ODM - object data mapper, JS layer on top of mongodb */

// mongoose.connect("mongodb://localhost:27017/camp_demo", {
//     useNewUrlParser: true
// });

const url = process.env.DATABASEURL || "mongodb://localhost:27017/camp_demo";
// ""

mongoose.connect(url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Database Connected :)");
}).catch((err) => {
    console.log("Database connection Failed :(", err.message);
});

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(methodOverride("_method"));
app.use(flash());

// Passport Config
app.use(require('express-session')({
    secret: "ldfhgkdhgiduuhgh ukgixuh fgkduhfg",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// Routes
app.use(indexRoutes);
app.use("/camps", campRoutes); // Prefix for camp routes
app.use("/camps/:id/comments", commentRoutes); // Prefix for Comment routes

// port
const PORT = process.env.PORT || 3000;
app.listen(PORT, process.env.IP, () => {
    console.log("YelpCamp Server has started....");
});