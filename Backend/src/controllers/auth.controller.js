const userModel=require('../models/user.model')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const tokenBlacklistModel=require('../models/blacklist.model')


const registerUserController=async(req,res)=>{
    const {username,email,password}=req.body;
    if(!username ||!email || !password){
        return res.status(400).json({
            message:"please provide username,email and password"
        })
    }
    const isUserAlreadyExists=await userModel.findOne({
        $or:[{username},{email}]
    })
    if(isUserAlreadyExists){
        return res.status(400).json({
            message:"username already exists with this username or email "
        })
    }
    const hash=await bcrypt.hash(password,10)//this is for hasing of password
    const user=await userModel.create({
        username,
        email,
        password:hash
    })
    const token=jwt.sign(
        {id:user._id,username:user.username},//data to be included in token 
        process.env.JWT_SECRET,//secret 
        {expiresIn:"1d"}
    )
    res.cookie("token",token)

    res.status(201).json({
        message:"User Registered Sucessfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
}
const loginUserController=async(req,res)=>{
    const{email,password}=req.body;
    const user=await userModel.findOne({email})

    if(!user){
        return res.status(200).json({
            message:"Invalid email or password"
        })
    }
    const isPasswordValid=await bcrypt.compare(password,user.password)
    if(!isPasswordValid){
        return res.status(400).json({
            message:"invalid email or password"
        })
    } 
    const token=jwt.sign(
        {id:user._id,username:user.username},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )
    res.cookie("token",token)
    res.status(200).json({
        message:"User LoggedIn Successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email

        }
    })

    
}
const logoutUserController=async(req,res)=>{
    const token=req.cookies.token

    if(token){
        await tokenBlacklistModel.create({token})
    }
    res.clearCookie("token")
    res.status(200).json({
        message:"user logged out successfully"
    })
}

//getting info of current user through this
const getMeController=async(req,res)=>{
    const user=await userModel.findById(req.user.id)

    res.status(200).json({
        message:"User details fetched successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
}
module.exports={registerUserController,loginUserController,logoutUserController,getMeController}