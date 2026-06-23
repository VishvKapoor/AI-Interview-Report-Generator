const jwt=require('jsonwebtoken')
const tokenBlacklistModel=require('../models/blacklist.model')

const authUser=async(req,res,next)=>{
    const token=req.cookies.token

    if(!token){
        return res.status(401).json({
            message:"Token not provided"
        })
    }
    const isTokenBlacklisted=await tokenBlacklistModel.findOne({token})
    if(isTokenBlacklisted){
        return res.status(401).json({
            message:"Token is invalid"
        })
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET)//taking out data from token 
        req.user=decoded//here we have created a new property in req that is "user" and in that we have set all data which is coming from JWT token
        next()
    }catch(err){
       return res.status(401).json({
        message:"Invalid-token"
       })
    }
}
module.exports={authUser}