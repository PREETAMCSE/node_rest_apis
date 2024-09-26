import UserModel from "./user.model.js";
import jwt from 'jsonwebtoken';
import UserRepository from "./user.repository.js";
import bcrypt from 'bcrypt';
import mongoose from "mongoose";


export default class UserController {

   constructor() {
    this.userRepository = new UserRepository();
   }

   async resetPassword(req,res){
        const {newPassword} = req.body;
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        const userId = req.userId;
    try {
        await this.userRepository.resetPassword(userId, hashedPassword);   
        res.status(200).send("Password is updated"); 
    } catch (err) {
        console.log(err);
        return res.status(500).send("Something went wrong");
    }
   }



    async signUp(req, res,next){
        try{
        const { name, email, password, type } = req.body;
        //const hashedPassword = await bcrypt.hash(password, 12)
        const user = new UserModel(name,email, password, type);
        console.log("User >> "+user);
        await this.userRepository.signUp(user);
        res.status(201).send(user);
        }catch(err){
            if(err instanceof mongoose.Error.ValidationError){
                console.log("Validation error in controller");
                next(err);
            }
            console.log(err);
        return res.status(500).send("Something went wrong");
        }
    }

    async signIn(req, res, next){
        try{
        //const result = UserModel.signIn(req.body.email,req.body.password);
        //const result = await this.userRepository.signIn(req.body.email, req.body.password);
        const user = await this.userRepository.findByEmail(req.body.email);
        if(!user){
            return res.status(400).send('User not found');
        }else{
            //compare password with hashed password
            console.log(user);
            const result = await bcrypt.compare(req.body.password, user.password);
            if(result){
                const token = jwt.sign({userId: user._id, email: user.email}, process.env.JWT_SECRET,{
                    expiresIn: '1h'
                });
                return res.status(200).send(token);
            }else{
                return res.status(400).send('Wrong password');
            } 
        }
    }catch(err){
        console.log(err);
        return res.status(500).send("Something went wrong");
    }
}


}