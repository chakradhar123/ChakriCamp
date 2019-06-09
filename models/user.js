const mongoose=require("mongoose"),
      passportLocalMongoose=require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
        username: String,
        password: String,
        avatar:{type:String,default:"https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"},
        firstName:String,
        lastName:String,
        email:{type: String, unique: true, required: true},
        resetPasswordToken: String,
    resetPasswordExpires: Date,
        isAdmin:{type:Boolean, default:false}
    });
UserSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("User",UserSchema);