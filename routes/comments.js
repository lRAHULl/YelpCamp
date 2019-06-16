const express = require("express"),
  Comment = require("../models/comment"),
  Camp = require("../models/camp"),
  middleware = require("../middleware"),
  router = express.Router({
    mergeParams: true
  });

// New Comment Route - Render the form
router.get("/new", middleware.isLoggedIn, (req, res) => {
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
router.post("/", middleware.isLoggedIn, (req, res) => {
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
          req.flash("success", "Succcessfully added comment!!");
          res.redirect(`/camps/${camp._id}`)
        }
      });
    }
  });
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
  Comment.findById(req.params.comment_id, (err, foundComment) => {
    if (!err) {
      res.render("comments/edit", {
        camp_id: req.params.id,
        comment: foundComment
      });
    }
  });
});

router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
    if (err) {
      req.flash("error", err.message);
      res.redirect("back");
    } else {
      req.flash("success", "Succcessfully edited comment!!");
      res.redirect(`/camps/${req.params.id}`);
    }
  })
});

router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndDelete(req.params.comment_id, (err, deletedComment) => {
    if (err) {
      req.flash("error", err.message);
      res.redirect("back");
    } else {
      req.flash("success", "Succcessfully deleted comment!!");
      res.redirect(`/camps/${req.params.id}`);
    }
  });
});

module.exports = router;