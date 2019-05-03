const Campground = require("../models/campground"),
      Comment    = require("../models/comment")
//all the middleware goes here
let middleWareObj = {};

middleWareObj.checkCampgroundOwnership = function(req,res,next){
if(req.isAuthenticated()){
    Campground.findOne({_id:req.params.id},function(err,foundCampground){
        if(err){
            req.flash("error", "Campgrounds not found!!");
            res.redirect("back");
        } 
        else{
            //does the user own campground
            if(foundCampground.author.id.equals(req.user._id)){
                next();
            }
            else{
                req.flash("error", "You dont have permission to do that");
                res.redirect("back");
            }
        }
});
}
else{
    req.flash("error", "You need to be logged in to do that!!");
    res.redirect("back");
}
}

middleWareObj.checkCommentOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findOne({_id:req.params.comment_id},function(err,foundComment){
            if(err){
                req.flash("error", "Campgrounds not found!!");
                res.redirect("back");
            } 
            else{
                //does the user own campground
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    req.flash("error", "You dont have permission to do that");
                    res.redirect("back");
                }
            }
    });
    }
    else{
        req.flash("error", "You need to be logged in to do that!!");
        res.redirect("back");
    }
}

middleWareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that!!");
    res.redirect("/login");
}
module.exports = middleWareObj;