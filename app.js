const app = require('express')(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    Camp = require("./models/camp"),
    Comment = require("./models/comment"),
    User = require('./models/user'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    seedDB = require("./seed")();
    
// Mongoose is a ODM - object data mapper, JS layer on top of mongodb
    
mongoose.connect("mongodb://localhost:27017/camp_demo", {useNewUrlParser: true});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));


// Passport
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


// Routes
app.get("/", (req, res) => {
   res.render("index"); 
});


app.get("/camps", (req, res) => {
    // Get all camps from DB and display
    Camp.find({}, (err, camps) => {
        if(err) {
            console.log("Something went wrong");
        } else {
            console.log(typeof camps);
            res.render("camps/index", {camps});
        }
    })
});

app.post("/camps", (req, res) => {
    const name = req.body.name,
        image = req.body.image,
        description = req.body.description;
    Camp.create({name, image, description}, (err, camp) => {
        if (err) {
            console.log("Something went wrong");
        } else {
            console.log(camp);
        }
    })
    
    res.redirect("/camps");
});

app.get("/camps/new", (req, res) => {
    res.render("camps/new");
});

// Showing a single camp
app.get("/camps/:id", (req, res) => {
    const id = req.params.id;
    Camp.findById(id).populate("comments").exec((err, camp) => {
        if(err) {
            console.log(err);
        } else {
            // console.log(camp);
            res.render("camps/show", {camp});
        }
    })
});

app.get("/camps/:id/comments/new", (req, res) => {
    Camp.findById(req.params.id, (err, camp) => {
       if (err) {
           console.log(err);
       } else {
           res.render("comments/new", {camp});
       }
    });
});

app.post("/camps/:id/comments", (req, res) => {
    Camp.findById(req.params.id, (err, camp) => {
        if (err) {
            console.log(err);
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err);
                    res.redirect("/camps/:id");
                } else {
                        camp.comments.push(comment);
                        camp.save;
                        console.log(comment);
                        res.redirect(`/camps/${camp._id}`)
                    }
            });
        }
    });
});

// AUTH
app.get("/register", (req, res) => {
    res.render("register");
})

app.post("/register", (req, res) => {
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req,res, () => {
            res.redirect("/camps");
        })
    })
});

app.get("/login", (req, res) => {
    res.render("login");
})

app.post("/login", passport.authenticate("local", {successRedirect: "/camps", failureRedirect: "/login"}));

function isLoggedIn(req, res, next) {
    if (req.authenticate()) {
        return next();
    }
}

// port
app.listen(process.env.PORT, process.env.IP, () => {
   console.log("YelpCamp Server has started...."); 
});