const app = require('express')(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    Camp = require("./models/camp"),
    Comment = require("./models/comment"),
    seedDB = require("./seed")();
    
// Mongoose is a ODM - object data mapper, JS layer on top of mongodb
    
mongoose.connect("mongodb://localhost:27017/camp_demo", {useNewUrlParser: true});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

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
            res.render("camps", {camps});
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
    res.render("new-camp");
});

// Showing a single camp
app.get("/camps/:id", (req, res) => {
    const id = req.params.id;
    Camp.findById(id).populate("comments").exec((err, camp) => {
        if(err) {
            console.log(err);
        } else {
            // console.log(camp);
            res.render("show", {camp});
        }
    })
});

app.listen(process.env.PORT, process.env.IP, () => {
   console.log("YelpCamp Server has started...."); 
});