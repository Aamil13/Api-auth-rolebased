const User = require('../models/User.model');
const bcrypt = require('bcrypt');


const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

exports.registerAdmin = async(req, res)=>{
    try{
        // console.log('file',req.file)
        if(req.file === undefined) return res.status(400).json({success:false,message:'Please upload an image file for profile picture.'}) 
        
        const {name, email, phone_number, password } = req.body;
        if(!email && !phone_number) return res.status(400).json({success:false,message:'At least email or phone number is required.'})
        if(email && !email.match(mailFormat)) return res.status(500).json({success:false,message:'Please enter valid email address.'})
        if(phone_number && (phone_number?.length !== 10 || isNumeric(phone_number) === false)) return res.status(500).json({success:false,message:'Please enter valid 10 digit phone number.'})
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
            name, email ,phone_number, profile_pic:dp ,password:passswordHash, user_type:'admin'
        })

        res.status(201).json({success:true, message:'Account Created Successfully, Login to continue'})
    }catch(err){
        console.log('error', err)
        return res.status(500).json({success:false,message:'Unable to create account. Please try later.'})
    }
}

exports.getAllUsers = async(req, res)=>{
    try{
        const users = await User.find({user_type:'user'}).select('-password')
        res.status(200).json({success:true, data:users})
    }catch(err){
        console.log('error get users', err)
        return res.status(500).json({success:false,message:'Unable to get users list. Please try later.'})
    }
}
exports.getSingle = async(req, res)=>{
    try{
        const user = await User.findById(req.params.id).select('-password')
        if(user.user_type === 'admin') return res.status(400).json({success:false,message:'Access Denied!'})
        res.status(200).json({success:true, data:user})
    }catch(err){
        return res.status(500).json({success:false,message:'Unable to get user info. Please try later.'})
    }
}
exports.deleteUser = async(req, res)=>{
    try{
        const user = await User.findById(req.params.id)
        if(user.user_type === 'admin') return res.status(400).json({success:false,message:'Access Denied!'})
        await user.deleteOne()
        res.status(200).json({success:true, data:'deleted successfully'})
    }catch(error){
        console.log('delete err', error)
        return res.status(500).json({success:false,message:'Unable to delete user. Please try later.'})
    }
}

exports.editUser = async(req, res)=>{
    try{
        const {name, email, phone_number} = req.body;
        if(email && !email.match(mailFormat)) return res.status(500).json({success:false,message:'Please enter valid email address.'})
        if(phone_number && (phone_number?.toString()?.length !== 10 || isNumeric(phone_number) === false)) return res.status(500).json({success:false,message:'Please enter valid 10 digit phone number.'})
        
        const user = await User.findById(req.params.id)
        if(user.user_type === 'admin') return res.status(400).json({success:false,message:'Access Denied!'})

        const updateItem = {
            name, email, phone_number
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id,
            updateItem,{
                new:true,
            }).select('-password')
        res.status(200).json({success:true, data:updatedUser})
    }catch(error){
        return res.status(500).json({success:false,message:'Unable to edit user. Please try later.'})
    }
}


function isNumeric(value) {
    return /^-?\d+$/.test(value);
}