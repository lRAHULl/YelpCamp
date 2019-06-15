const Comment = require("../models/comment"),
  Camp = require("../models/camp");

let middlewareObj = {};

middlewareObj.isLoggedIn = (req, res, next) => {
  // console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/login");
}

middlewareObj.checkCampOwnership = (req, res, next) => {
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

middlewareObj.checkCommentOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        res.redirect("back");
      } else {
        if (foundComment.author.id.equals(req.user._id)) {
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

module.exports = middlewareObj;