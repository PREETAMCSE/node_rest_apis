import mongoose from "mongoose";
import { categorySchema } from "../features/product/category.schema.js";

export const connectUsingMongoose = async()=>{
    try{
    await mongoose.connect(process.env.MONGO_DB_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true 
    });
    console.log("Mongo db connected using mongoose")
    addCategories();
}catch(err){
    console.log("Error while connecting to db");
    console.log(err);
}
}

async function addCategories(){
    const categoryModel = mongoose.model('Category', categorySchema);
    const categories = await categoryModel.find();
    if(!categories || categories.length==0){
        await categoryModel.insertMany([
            {
                name : 'Books'
            },
            {
                name : 'Clothing'
            },
            {
                name : 'Electronics'
            }
        ])
    }
    console.log("Categories are added");
}