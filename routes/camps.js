const express = require("express"),
  Camp = require("../models/camp"),
  router = express.Router();

// Camp Index Routes
router.get("/", (req, res) => {
  // Get all camps from DB and display
  console.log(req.user);
  Camp.find({}, (err, camps) => {
    if (err) {
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
router.post("/", isLoggedIn, (req, res) => {
  const name = req.body.name,
    image = req.body.image,
    description = req.body.description,
    author = {
      id: req.user._id,
      username: req.user.username
    };
  Camp.create({
    name,
    image,
    description,
    author
  }, (err, camp) => {
    if (err) {
      console.log("Something went wrong");
    } else {
      console.log(camp);
    }
  })

  res.redirect("/camps");
});

// New Camp Route - Render the form
router.get("/new", isLoggedIn, (req, res) => {
  res.render("camps/new");
});

// Showing a single camp
router.get("/:id", (req, res) => {
  const id = req.params.id;
  Camp.findById(id).populate("comments").exec((err, camp) => {
    if (err) {
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
router.get("/:id/edit", isAuthorized, (req, res) => {
  Camp.findById(req.params.id, (err, camp) => {
    if (err) {
      return res.redirect("/camps");
    }
    return res.render("camps/edit", {
      camp
    });
  });
});

// Update camp route
router.put("/:id", isAuthorized, (req, res) => {
  Camp.findByIdAndUpdate(req.params.id, req.body.camp, (err, updatedCamp) => {
    if (err) {
      res.redirect("/camps");
    } else {
      res.redirect(`/camps/${req.params.id}`);
    }
  });
});

// Destroy Camp Route
router.delete("/:id", isAuthorized, (req, res) => {
  Camp.findByIdAndDelete(req.params.id, (err, deletedCamp) => {
    if (err) {
      res.redirect("/camps");
    } else {
      res.redirect("/camps");
    }
  });
})

// MiddleWare
function isLoggedIn(req, res, next) {
  // console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/login");
}

function isAuthorized(req, res, next) {
  if (req.isAuthenticated()) {
    Camp.findById(req.params.id, (err, foundCamp) => {
      if (err) {
        res.redirect("back");
      } else {
        if (foundCamp.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect("back");
        }
      }
    })
  } else {
    res.redirect("/login");
  }
}

module.exports = router;