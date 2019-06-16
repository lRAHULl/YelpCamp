const express = require("express"),
  passport = require('passport'),
  User = require('../models/user'),
  router = express.Router();

router.get("/", (req, res) => {
  res.render("index");
});

// AUTH
// Render the Register form
router.get("/register", (req, res) => {
  res.render("register");
})

// Register Route
router.post("/register", (req, res) => {
  const newUser = new User({
    username: req.body.username
  });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      req.flash("error", err.message);
      res.redirect("/register");
    } else {
      // using local strategy in passport
      passport.authenticate("local")(req, res, () => {
        req.flash("success", `Signed you up, Have a great day ${user.username} :)`);
        res.redirect("/camps");
      });
    }
  });
});

// Render the login Form
router.get("/login", (req, res) => {
  res.render("login");
})

// Login  Route
router.post("/login", passport.authenticate("local", {
  successRedirect: "/camps",
  failureRedirect: "/login"
}));

// Logout Route
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Logged you out!!");
  res.redirect("/");
}, () => {});

// MiddleWare
function isLoggedIn(req, res, next) {
  // console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/login");
}

module.exports = router;