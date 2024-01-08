const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        unique:true,
        trim:true,
    },
    phone_number:{
        type:String,
        unique:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
    },
    profile_pic:String,
    user_type:{
        type:String,
        enum:["user", "admin"],
        default:'user',
    }
},{timestamps:true});

//Schema methods
UserSchema.methods.signJwtToken = function(){
    return jwt.sign({id: this._id}, process.env.AUTH_TOKEN,{
        expiresIn: '30d'
    })
}

module.exports = mongoose.model("users", UserSchema);