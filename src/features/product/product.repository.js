import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import mongoose from "mongoose";
import { productSchema } from "./product.schema.js";
import { reviewSchema } from "./review.schema.js";
import { categorySchema } from "./category.schema.js";

const ProductModel = mongoose.model('Product', productSchema);
const ReviewModel = mongoose.model('Review', reviewSchema);
const categoryModel = mongoose.model('Category', categorySchema)


class ProductRepository {

    constructor(){
        this.collection = "products";
    }

    async add(newProduct){
      try {
        // Get Db
        const db = getDB();
        // Get the collection
        const collection = db.collection(this.collection);
        await collection.insertOne(newProduct);
        return newProduct;
      } catch (error) {
        console.log(error);
        throw new ApplicationError("Something went wrong with db", 500);
      }
    }

    async addUsingRelation(productData){
      productData.categories = productData.category.split(',').map(e => e.trim());
      try {
        //1. Add the product
        const newProduct = new ProductModel(productData);
        const savedProduct = await newProduct.save();

        // 2. Update the categories
        await categoryModel.updateMany(
          {_id: {$in: newProduct.categories}},
          { $push : {products: new ObjectId(savedProduct._id)}}
        );
      } catch (error) {
        console.log(error);
        throw new ApplicationError("Something went wrong with db", 500);
      }
    }

    async getAll(){
      try {
        const db = getDB();
        const collection = db.collection(this.collection);
        return await collection.find().toArray();
          
      } catch (error) {
        console.log(error);
        throw new ApplicationError("Something went wrong with db", 500);
      }
    }

    async get(id){
        try {
            const db = getDB();
            const collection = db.collection(this.collection);
            return await collection.findOne({_id: new ObjectId(id)});
          } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong with db", 500);
          }
    }
    
    // Filter with comparison operator
    async filter(minPrice, maxPrice, category){
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
             let filterExpression = {}; 
             if(minPrice){
                filterExpression.price = { $gte: parseFloat(minPrice)}
             }
             if(maxPrice){
                filterExpression.price = {...filterExpression.price,$lte: parseFloat(maxPrice)}
             }
             if(category){
                filterExpression.category=category;
             }
             return collection.find(filterExpression).toArray(); 
        }catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong with db", 500);
          }
    }

    // Filter with logical operator
    async filterWithLogicalOperatorOrAndIn(minPrice, maxPrice, categories){
      try{
          const db = getDB();
          const collection = db.collection(this.collection);
           let filterExpression = {}; 
           if(minPrice){
              filterExpression.price = { $gte: parseFloat(minPrice)}
           }
           if(categories){
              categories = JSON.parse(categories.replace(/'/g, '"'));
              console.log("Category "+categories);
              filterExpression = {$or:[{category:{$in:categories}}, filterExpression]}
           }
           //return collection.find(filterExpression).toArray(); 
           // Return with projection i.e only required fields - 0 means to exclude and 1 means to include
           //slice with return only one rating
           // -1 in slie will return last rating
           // -2 will return last 2 ratings
           return collection.find(filterExpression).project({name:1, price : 1, _id : 0, ratings : {$slice : 1}}).toArray(); 
      }catch (error) {
          console.log(error);
          throw new ApplicationError("Something went wrong with db", 500);
        }
  }

    async rate(userId, productId, rating){
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
            // 1. Find the product
            const product = await collection.findOne({_id : new ObjectId(productId)});
            // 2. Find the ratings
            const userRating = product?.ratings?.find(r=> r.userId == userId);
            if(userRating){
                // 3. Update the rating
                await collection.updateOne(
                    {
                  _id : new ObjectId(productId), "ratings.userId" : new ObjectId(userId)
                    } ,
                  {
                    $set : {"ratings.$.rating" : rating}
                  })
            }else{
                await collection.updateOne({
                    _id : new ObjectId(productId)
                },{
                    $push : {ratings : {userId : new ObjectId(userId), rating}}
                })
            }
        }catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong with db", 500);
          }
    }

    async rateByRelation(userId, productId, rating){
      try{
          // 1. Check if product exists
          const productToUpdate = await ProductModel.findById(productId);
          if(!productToUpdate){
            throw new Error("Product not found");
          }
          // 2. Get the existing reviews of the user
          const userReview = await ReviewModel.findOne({product : new ObjectId(productId), user:new ObjectId(userId)});
          if(userReview){
            userReview.rating = rating;
            await userReview.save();
          }else{
            const newReview = new ReviewModel({
              product : new ObjectId(productId), 
              user:new ObjectId(userId),
              rating : rating
            })
            newReview.save();
          }
      }catch (error) {
          console.log(error);
          throw new ApplicationError("Something went wrong with db", 500);
        }
  }

    async rateHandleRaceCondition(userId, productId, rating){
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
         
            // Removes existing entry
            await collection.updateOne({
                    _id : new ObjectId(productId)
            },
            {
                    $pull : {ratings : {userId : new ObjectId(userId)}}
            })


            await collection.updateOne({
                _id : new ObjectId(productId)
            },{
                $push : {ratings : {userId : new ObjectId(userId), rating}}
            })
           
        }catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong with db", 500);
          }
    }

    async averageProductPricePerCategory(){
      try{
        const db = getDB();
        return await db.collection(this.collection)
          .aggregate([
            {
              // 1. Stage 1 : We want average price per category
              $group:{
                _id : "$category",
                averagePrice: {$avg : "$price"}
              }
            }
          ]).toArray();

      }catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong with db", 500);
          }
    }
}

export default ProductRepository;