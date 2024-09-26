import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";


export default class CartRepository {

    constructor(){
        this.collection = "cartItems";
    }

    async add(productId, userId, quantity) {
        try {
            const db = getDB();
            const collection = db.collection(this.collection);
            const id = await this.getNextCounter(db);
    
            // Define the filter to find the existing document
            const filter = {
                productId: new ObjectId(productId),
                userId: new ObjectId(userId)
            };
            console.log("ProductId " +productId);
    
            // Define the update operation
            const updateOperation = {
                $setOnInsert: { _id: id }, // Set _id only if the document is inserted
                $inc: { quantity: quantity } // Increment the quantity field
            };
            console.log("Update "+updateOperation);
            // Perform the update with upsert option
            const result = await collection.updateOne(filter, updateOperation, { upsert: true });
    
            // Log the result for debugging purposes (optional)
            console.log(result);
    
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong with db", 500);
        }
    }
    

    async get(userId){
        try{
            const db = getDB();
            const collection = db.collection(this.collection)
            return await collection.find({userId : new ObjectId(userId)}).toArray();

        }catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong with db", 500);
          }
    }

    async delete(cartItemId,userId) {
        try{
            const db = getDB();
            const collection = db.collection(this.collection)
            const result = await collection.deleteOne({_id : new ObjectId(cartItemId), userId : new ObjectId(userId)});
            return result.deletedCount>0;
        }catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong with db", 500);
          }
    }

    async getNextCounter(db){
        const resultDoc = await db.collection("counters").findOneAndUpdate({_id : 'cartItemId'}, {$inc : {value: 1}},
        {returnDocument: 'after'}
        )
        console.log(resultDoc);
        return resultDoc.value;
    }


}