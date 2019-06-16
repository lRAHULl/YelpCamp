const express = require("express"),
  Camp = require("../models/camp"),
  middleware = require("../middleware"),
  router = express.Router();

// Camp Index Routes
router.get("/", (req, res) => {
  // Get all camps from DB and display
  console.log(req.user);
  Camp.find({}, (err, camps) => {
    if (err) {
      req.flash("error", err.message);
      console.log("Something went wrong");
    } else {
      console.log(typeof camps);
      res.render("camps/index", {
        camps
      });
    }
  })
});

// Create Camp Route
router.post("/", middleware.isLoggedIn, (req, res) => {
  const name = req.body.name,
    image = req.body.image,
    description = req.body.description,
    price = req.body.price,
    author = {
      id: req.user._id,
      username: req.user.username
    };
  Camp.create({
    name,
    image,
    description,
    price,
    author
  }, (err, camp) => {
    if (err) {
      req.flash("error", err.message);
      // console.log("Something went wrong");
      res.redirect("/camps");
    } else {
      req.flash("success", "Successfully added camp!");
      // console.log(camp);
      res.redirect("/camps");
    }
  })
});

// New Camp Route - Render the form
router.get("/new", middleware.isLoggedIn, (req, res) => {
  res.render("camps/new");
});

// Showing a single camp
router.get("/:id", (req, res) => {
  const id = req.params.id;
  Camp.findById(id).populate("comments").exec((err, camp) => {
    if (err) {
      req.flash("error", err.message);
      console.log(err);
    } else {
      // console.log(camp);
      res.render("camps/show", {
        camp
      });
    }
  })
});

// Edit Camp Route
router.get("/:id/edit", middleware.checkCampOwnership, (req, res) => {
  Camp.findById(req.params.id, (err, camp) => {
    if (err) {
      req.flash("error", err.message);
      return res.redirect("/camps");
    }
    return res.render("camps/edit", {
      camp
    });
  });
});

// Update camp route
router.put("/:id", middleware.checkCampOwnership, (req, res) => {
  Camp.findByIdAndUpdate(req.params.id, req.body.camp, (err, updatedCamp) => {
    if (err) {
      req.flash("error", err.message);
      res.redirect("/camps");
    } else {
      req.flash("success", "Successfully edited camp!");
      res.redirect(`/camps/${req.params.id}`);
    }
  });
});

// Destroy Camp Route
router.delete("/:id", middleware.checkCampOwnership, (req, res) => {
  Camp.findByIdAndDelete(req.params.id, (err, deletedCamp) => {
    if (err) {
      req.flash("error", err.message);
      res.redirect("/camps");
    } else {
      req.flash("success", "Successfully deleted camp!");
      res.redirect("/camps");
    }
  });
})

module.exports = router;