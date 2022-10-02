const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
require("dotenv").config();
require("../models/connn");

const userSchema = new mongoose.Schema({
     firstname: {
      type:String,
      required:true,
      trim:true
   },
     lastname:{
      type:String,
      required:true,
      trim:true
   },
     email:{
        type:String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
      },
     dob:{
        type:Date,
        required: true,
        trim: true,
     },
     contact:{
      type:Number,
      required: true,
      trim:true
     },
     password: {
      type:String,
      required: true,
      trim:true
     },
     cpassword : {
      type:String,
      required: true,
      trim:true
     },
     tokens:[{
      token:{
         type:String,
         required:true
      }
     }]
})


userSchema.methods.generateAuthToken = async function(){
   try{
      let temptoken = jwt.sign({_id:this._id}, process.env.SECRET_KEY)
      this.tokens = this.tokens.concat({token:temptoken});
      await this.save();
      return temptoken;
   }catch(err){
      console.log(err);
   }
}
module.exports  = mongoose.model("User",userSchema);
