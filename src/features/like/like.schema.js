import mongoose from "mongoose";

export const likeSchema = new mongoose.Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  likeable:{
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'types'
  },
  types:{
    type: String,
    enum: ['Product', 'Category']
  }  
}).pre('save', (next)=>{
  console.log("New likes coming in");
  next();
}).post('save',(next,doc)=>{
 console.log("Like Saved");
 console.log(doc); 
}).pre('find', (next)=>{
console.log("Fetching likes");
next();
}).post('find',(docs)=>{
  console.log("Find completed");
  console.log(docs);
})