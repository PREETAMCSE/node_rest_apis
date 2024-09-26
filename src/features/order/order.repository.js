import { ObjectId } from "mongodb";
import { getClient, getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import OrderModel from "./order.model.js";

export default class OrderRepository {

    constructor() {
        this.collection = "orders";
    }

    async placeOrder(userId){    
        const client = getClient();
        const session = client.startSession();    
        try {
            const db = getDB();
            session.startTransaction();
        // 1. Get cartitems and calculate total amount
            const items = await this.getTotalAmount(userId,session);
            const finaltotalAmount = items.reduce((acc, item) => acc+item.totalAmount, 0);
            console.log(finaltotalAmount);
             // 2. Create an order record
             const newOrder = new OrderModel(new ObjectId(userId), finaltotalAmount, new Date());
             await db.collection(this.collection).insertOne(newOrder, {session});
               // 3. Reduce the stock
            for(let item of items){
                await db.collection("products").updateOne(
                    {_id : item.productId},
                    {$inc : {stock : -item.quantity}},{session}
                )
            }  
            // 4. Clear the cart item
            await db.collection("cartItems").deleteMany({
                userId : new ObjectId(userId)
            }, {session});
            session.commitTransaction();
            session.endSession();
         return;
        } catch (error) {
            await session.abortTransaction();
            session.endSession(); 
            console.log(error);
            throw new ApplicationError("Something went wrong with db", 500);
        }
    }


    async getTotalAmount(userId,session){
     const db = getDB();
     const items = await db.collection("cartItems").aggregate([
        // 1. Get cart items for the user
        {
            $match : {userId : new ObjectId(userId)}
        },
         // 2. Get the products from product collection using product id of cart items
         {
            $lookup: {
                from : "products",
                localField : "productId",
                foreignField: "_id",
                as: "productInfo"
            }
         },
         //3. Unwind the product info
         {
            $unwind : "$productInfo"
         },
         // 4. Calculate total amount for each cart item
         {
            $addFields : {
                "totalAmount": {
                    $multiply:["$productInfo.price", "$quantity"]
                }
            }
         }
     ], {session}).toArray();
     console.log(items);
     return items;
    }
}