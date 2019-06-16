const Comment = require("../models/comment"),
  Camp = require("../models/camp");

let middlewareObj = {};

middlewareObj.isLoggedIn = (req, res, next) => {
  // console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
  }
}

middlewareObj.checkCampOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Camp.findById(req.params.id, (err, foundCamp) => {
      if (err) {
        req.flash("error", "Camp not found!");
        res.redirect("back");
      } else {
        if (foundCamp.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You don't have permission to do that!");
          res.redirect("back");
        }
      }
    })
  } else {
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
  }
}

middlewareObj.checkCommentOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        res.redirect("back");
      } else {
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You don't have permission to do that!");
          res.redirect("back");
        }
      }
    })
  } else {
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
  }
}

module.exports = middlewareObj;