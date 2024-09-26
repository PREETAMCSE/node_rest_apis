import "./env.js"
import express from "express";
import swagger, { serve } from "swagger-ui-express";
import bodyParser from "body-parser";
import cors from 'cors';
import productRouter from "./src/features/product/product.routes.js";
import userRouter from "./src/features/user/user.routes.js";
import basicAuthorizer from "./src/middlewares/basicAuth.middleware.js";
import jwtAuth from "./src/middlewares/jwt.middleware.js";
import cartRouter from "./src/features/cart/cart.routes.js";
import apiDocs from "./swagger.json" assert {type: 'json'};
import loggerMiddleware from "./src/middlewares/logger.middleware.js";
import { ApplicationError } from "./src/error-handler/applicationError.js";
import { connectToMongoDB }  from "./src/config/mongodb.js";
import orderRouter from "./src/features/order/order.routes.js";
import { connectUsingMongoose } from "./src/config/mongooseconfig.js";
import mongoose from "mongoose";
import likeRouter from "./src/features/like/like.router.js";


const server = express();

// load all env variables in application

//CORS policy configuration manually
/* server.use((req, res, next)=>{
   res.header('Access-Control-Allow-Origin', "*")
   res.header('Access-Control-Allow-Headers',"*");
   res.header('Access-Control-Allow-Methods', '*')
   // Return ok for preflight request
   if(req.method=='OPTIONS'){
    return res.sendStatus(200);
   }
   next();
}) */

//CORS policy configuration using cors library
var corsOptions = {
    origin : '*',
    allowedHeaders:'*'
}
server.use(cors(corsOptions));
server.use(bodyParser.json());
server.use(loggerMiddleware);
// for all requests related to product, redirect to product routes
server.use('/api-docs', swagger.serve, swagger.setup(apiDocs));
server.use("/api/products", jwtAuth, productRouter);
server.use('/api/users',userRouter);
server.use('/api/likes', jwtAuth, likeRouter);
server.use("/api/cart", jwtAuth, cartRouter);
server.use("/api/orders", jwtAuth, orderRouter);

server.get("/", (req,res)=>{
    res.send("Welcome to E-commerce APIs");
})

//Error handling middleware
server.use((err, req, res, next) => {
  console.log(err+ "Got error in router");
  if(err instanceof mongoose.Error.ValidationError){
    return res.status(400).send(err.message);
  }
  if (err instanceof ApplicationError) {
    return res.status(err.code).send(err.message);
  }

  // server errors.
  res
    .status(500)
    .send(
      'Something went wrong, please try later'
    );
});

//Middleware to handle 404 requests
server.use((req,res) => {
  res.status(404).send("API not found");
})

const PORT=process.env.SERVER_PORT || 3100
server.listen(PORT,()=>{
    console.log(`Server is running at ${PORT}`);
    //connectToMongoDB();
    connectUsingMongoose();
});



