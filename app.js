const express   =require('express'),
      app       =express(),
      bodyParser=require('body-parser'),
      mongoose  =require("mongoose"),
      flash=require("connect-flash"),
      passport=require("passport"),
      LocalStrategy=require("passport-local"),
      FacebookStrategy = require('passport-facebook').Strategy,
      methodOverride=require("method-override"),
      Campground=require("./models/campground"),
      Comment=require("./models/comment"),
      User=require("./models/user"),
      seedDB=require("./seeds");
const commentRoutes=require("./routes/comments"),
      campgroundRoutes=require("./routes/campgrounds"),
      indexRoutes=require("./routes/index");
const url=process.env.databaseUrl || "mongodb://localhost:27017/yelp--camp"
mongoose.connect(url, {useNewUrlParser: true,useCreateIndex: true},function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log("mongoose atlas was successfully connected");
    }
});
    
      
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seed database
//seedDB();

//PASSPORT CONFIGURTION
app.use(require("express-session")({
    secret:"My yelpcamp",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));



passport.use(new FacebookStrategy({
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: process.env.callbackURL,
    profileFields: ['email','name','photos']
  },
  function(accessToken, refreshToken, profile, done) {
     
    
    process.nextTick(function() {
        User.findOne({username:profile.name.givenName}, function(err, user) {
            if (err){
                req.flash("error", err.message);
            return res.redirect("/register");
            }
                    ;
                    if (user) {
                        
                        return done(null, user); 
                    } else {
                        let newUser=new User({username:profile.name.givenName,firstName:profile.name.familyName,lastName:profile.name.middleName,email:profile.emails[0].value,avatar:profile.photos[0].value});
                            
                        // save our user to the database
                        newUser.save(function(err) {
                            if (err){
                                req.flash("error", err.message);
                                return res.redirect("/register");
                            }
                                
    
                            // if successful, return the new user
                            
                            return done(null, newUser);
                        });
                    }
                });
            });
  }
));
passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

app.use(function (req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
})

app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);





app.listen(process.env.PORT || 8000,function(){
    console.log("The YelpCamp server has started!");
});