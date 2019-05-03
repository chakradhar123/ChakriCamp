const express=require("express"),
      router=express.Router(),
      Campground=require("../models/campground"),
      Comment=require("../models/comment"),
      middleware=require("../middleware");



//INDEX-show allcampgrounds
router.get("/",function(req,res){
    //Get all campgrounds from DB
    Campground.find({},function(err,allcampgrounds){
        if(err){
            console.log(err);
        }
        else{
              res.render("campgrounds/index",{campgrounds:allcampgrounds});
        }
    })
  
});
//CREATE
router.post("/",middleware.isLoggedIn,function(req,res){
    //get data from form and add to campgrounds array
    let name=req.body.name;
    let image=req.body.image;
    let description=req.body.description;
    let price=req.body.price;
    let author={
        id:req.user._id,
        username:req.user.username
    };
    
    let newCampground={name:name,price:price ,image:image,description:description,author:author};
    //create a new campground and save to DB
    Campground.create(newCampground,function(err,newlyCreated){
        if(err){
            console.log(err);
        }
        else{
            //redirect back to campgrounds
            res.redirect("/campgrounds")
        }
    })
    
});
//NEW
router.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("campgrounds/new");
});
//SHOW
router.get("/:id",function(req,res){
    Campground.findOne({_id:req.params.id}).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/show",{campground:foundCampground});
        }
    });
    
});
//Edit campground route
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
        Campground.findOne({_id:req.params.id},function(err,foundCampground){
            if(err){
                res.redirect("back");
            }
            res.render("campgrounds/edit",{campground:foundCampground});
        });   
});
//Update campground route
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
    //find and update campground
    Campground.findOneAndUpdate({_id:req.params.id},req.body.campground,function(err,updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } 
        else {
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
})

//Destroy campground route 
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findOneAndDelete({_id:req.params.id},function(err,campgroundRemoved){
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            Comment.deleteMany( {_id: { $in: campgroundRemoved.comments } }, (err) => {
                if (err) {
                    console.log(err);
                }
                else{
                    res.redirect("/campgrounds");
                }
            });
        }
    });
});

module.exports=router;