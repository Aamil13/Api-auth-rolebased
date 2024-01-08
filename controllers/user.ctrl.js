const User = require('../models/User.model');
const bcrypt = require('bcrypt');

const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

//register
exports.register = async(req, res)=>{
    try{
        // console.log('file',req.file)
        if(req.file === undefined) return res.status(400).json({success:false,message:'Please upload an image file for profile picture.'}) 
        
        const {name, email, phone_number, password, file} = req.body;
        if(!email && !phone_number) return res.status(400).json({success:false,message:'At least email or phone number is required.'})
        if(email && !email.match(mailFormat)) return res.status(500).json({success:false,message:'Please enter valid email address.'})
        if(phone_number && (phone_number?.toString()?.length !== 10 || isNumeric(phone_number) === false)) return res.status(500).json({success:false,message:'Please enter valid 10 digit phone number.'})
        if(!name || !password) return res.status(500).json({success:false,message:'Name and password is required'})
        
        // console.log('req.body' ,name, email, phone_number, password, file)
        let dp = 'http://localhost:5000/images/'+req.file.filename

        const user = await User.findOne({
            $or: [
              { email },
              { phone_number }
            ]
          })
        if(user) return res.status(400).json({success:false, message:"User Already Exists"})

        //encrypt password
        const passswordHash = await bcrypt.hash(password, 12)

        await User.create({
            name, email ,phone_number, profile_pic:dp ,password:passswordHash
        })

        res.status(201).json({success:true, message:'Account Created Successfully, Login to continue'})
    }catch(err){
        console.log('error', err)
        return res.status(500).json({success:false,message:'Unable to create account. Please try later.'})
    }
}

//user_name key can accept email or phone_number.
exports.login = async(req, res)=>{
    try{
        const {user_name } = req.body;
         const user = await User.findOne({
            $or: [
              { email: user_name },
              { phone_number: user_name }
            ]
          })
        //const user = await User.findOne({email: req.body.email})
        if(!user) return res.status(400).json({success:false, message:'Invalid Credentials1'})
console.log('user', user)
        const passMatch = await bcrypt.compare(req.body.password.toString(), user.password)
        if(!passMatch) return res.status(400).json({success:false, message:'Invalid Credentials2'})

        const token = user.signJwtToken();
        const {password, ...others} = user._doc;
        res.status(200).json({success:true, token, data:others})
    }catch(err){
        console.log('login err', err)
        return res.status(500).json({success:false, message:'Unable to login. Please try later.'}) 
    }
}

exports.updateName = async(req, res)=>{
    try{
        
        const {name} = req.body;
        if(!name) return res.status(400).json({success:false, message:'Invalid name.'})
        const updateItem = {
            name
        }
        const updatedUser = await User.findByIdAndUpdate(req.user.id,
            updateItem,{
                new:true,
            }).select('-password')

        res.status(201).json({success:true, data: updatedUser})
    }catch(err){
        return res.status(500).json({success:false,message:'Unable to update account. Please try later.'})
    }
}

exports.updateDP = async(req, res)=>{
    try{
        if(req.file === undefined) return res.status(400).json({success:false,message:'Please upload an image file for profile picture.'}) 
        
        let dp = 'http://localhost:5000/images/'+req.file.filename

        const updateItem = {
            profile_pic:dp
        }

        const updatedUser = await User.findByIdAndUpdate(req.user.id,
            updateItem,{
                new:true,
            }).select('-password')

        res.status(201).json({success:true, data: updatedUser})
    }catch(err){
        return res.status(500).json({success:false,message:'Unable to update Profile pic. Please try later.'})
    }
}

exports.deleteSelf = async(req, res)=>{
    try{
        await User.findByIdAndDelete(req.user.id)
        res.status(200).json({success:true, data:"Account deleted successfully"})
    }catch(err){
        return res.status(500).json({success:false,message:'Unable to delete account. Please try later.'})
    }
}

function isNumeric(value) {
    return /^-?\d+$/.test(value);
}