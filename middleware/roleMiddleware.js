exports.roleMiddleware = (userType='all') => {
    return(req, res, next) =>{
        if(userType !== 'all' && req.user.user_type !== userType){
            return res.status(400).json({status:false,message:'Not Allowed'})
        }
        next()
        
    }
}
