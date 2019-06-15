const express = require("express"),
  Comment = require("../models/comment"),
  Camp = require("../models/camp"),
  router = express.Router({
    mergeParams: true
  });

// New Comment Route - Render the form
router.get("/new", isLoggedIn, (req, res) => {
  Camp.findById(req.params.id, (err, camp) => {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", {
        camp
      });
    }
  });
});

// Create Comment Route
router.post("/", isLoggedIn, (req, res) => {
  Camp.findById(req.params.id, (err, camp) => {
    if (err) {
      console.log(err);
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err);
          res.redirect("/camps/:id");
        } else {
          // Associate User with the comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          // Save the comment
          comment.save();
          // Add the comment to the comments array of that camp
          camp.comments.push(comment);
          // Save the camp
          camp.save();
          console.log(comment);
          res.redirect(`/camps/${camp._id}`)
        }
      });
    }
  });
});

// MiddleWare
function isLoggedIn(req, res, next) {
  // console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/login");
}

module.exports = router;