const express=require('express');
const {registerUserController,loginUserController,logoutUserController,getMeController}=require('../controllers/auth.controller')
const{authUser}=require('../middlewares/auth.middleware')
const authRouter=express.Router()



authRouter.post('/register',registerUserController)

authRouter.post('/login',loginUserController)

authRouter.get('/logout',logoutUserController)



//this route  is used to get the currently logged-in user's information using the token.
authRouter.get('/get-me',authUser,getMeController)

module.exports=authRouter 