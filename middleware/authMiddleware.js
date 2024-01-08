const jwt = require('jsonwebtoken')
const User = require('../models/User.model')

const authMiddleware = async(req, res, next)=>{
    try{
        //Bearer <token>
        const token = req.headers.authorization.split(' ')[1];
        if(!token){
            return res.status(400).json('Invalid Authentication')
        }
        const verified = jwt.verify(token, process.env.AUTH_TOKEN)

        req.user = await User.findById(verified.id)
        if(!req.user) return res.status(401).json({status:false,message:'Not Authorized'})
        next();

    }catch(err){
        return res.status(401).json({status:false,message:'Not Authorized'})
    }
}

module.exports = authMiddleware