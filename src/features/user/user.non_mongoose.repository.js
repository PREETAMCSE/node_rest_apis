import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

class UserRepository {

    constructor(){
      this.collection = "users";
    }

    async signUp(newUser){
        try{
        // Get the database
        const db = getDB();
        // Get the collection
        const collection = db.collection(this.collection);
        // Insert collection into db
        await collection.insertOne(newUser);
        newUser.password = undefined;
        return newUser;
        }catch(err){
            throw new ApplicationError("Something went wrong with db", 500);
        }
    }

    async signIn(email, password){
        try{
        // Get the database
        const db = getDB();
        // Get the collection
        const collection = db.collection(this.collection);
        // Insert collection into db
        return await collection.findOne({email, password});
        return newUser;
        }catch(err){
            throw new ApplicationError("Something went wrong with db", 500);
        }
    }

    async findByEmail(email){
        try{
        // Get the database
        const db = getDB();
        // Get the collection
        const collection = db.collection(this.collection);
        // Insert collection into db
        return await collection.findOne({email});
        return newUser;
        }catch(err){
            throw new ApplicationError("Something went wrong with db", 500);
        }
    }

}

export default UserRepository