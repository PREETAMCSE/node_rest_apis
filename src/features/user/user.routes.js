import jwtAuth from '../../middlewares/jwt.middleware.js';
import UserController  from './user.controller.js';
// This will manage routes/path to ProductController

//1. import express
import express from 'express';

// 2. Initialize express router

const userRouter = express.Router();

const userController = new UserController();
userRouter.post("/signup", (req,res,next)=>{
    userController.signUp(req,res,next);
});
userRouter.post("/signin", (req,res)=>{
    userController.signIn(req,res)
});

userRouter.put('/resetPassword', jwtAuth, (req,res,next) => {
    userController.resetPassword(req,res,next);
});


export default userRouter;
