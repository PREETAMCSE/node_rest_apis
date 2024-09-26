import mongoose from "mongoose";
import { userSchema } from "./user.schema.js";
import { ApplicationError } from "../../error-handler/applicationError.js";


//Creating model from Schema

const UserModel = mongoose.model('User', userSchema);

export default class UserRepository{

    async resetPassword(userId, hashedPassword,next){
        try {
            let user = await UserModel.findById(userId);
            console.log("User : "+user);
            if(user){
                user.password = hashedPassword;
                user.save();
            }else{
                throw new Error("No such user found");
            }
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong with db", 500);
            next(error);
        }
    }

    async signUp(user){
        try {
             // Create instance of model
                const newUser = new UserModel(user);
                await newUser.save(); 
                return newUser;
        } catch (error) {
            console.log(error);
            if(error instanceof mongoose.Error.ValidationError){
                throw error;
            }else{
                console.log(error);
                throw new ApplicationError("Something went wrong with database", 500);
            }
        }
    }   

    async signIn(email, password){
        try {
             return await UserModel.findOne({email, password});
               
       } catch (error) {
           console.log(error);
           throw new ApplicationError("Something went wrong with db", 500);
       }
    }

    async findByEmail(email){
        try{
        return await UserModel.findOne({email});
        return newUser;
        }catch(err){
            throw new ApplicationError("Something went wrong with db", 500);
        }
    }
}