import ProductController from './product.controller.js';
import {upload} from '../../middlewares/fileupload.middleware.js'
// This will manage routes/path to ProductController

//1. import express
import express from 'express';

// 2. Initialize express router

const productRouter = express.Router();

const productController = new ProductController();
productRouter.get("/", (req,res)=>{
    productController.getAllProducts(req,res);
});
productRouter.post("/", upload.single('imageUrl'), (req,res)=>{
    productController.addProduct(req,res);
});
productRouter.get("/filter", (req,res)=>{
    productController.filterProducts(req,res)
});
productRouter.post("/rate", (req,res, next)=>{
    productController.rateProduct(req,res, next);
});

productRouter.get("/average-price", (req,res)=>{
    productController.averagePrice(req,res);
});
productRouter.get("/getById/:id", (req,res)=>{
    productController.getOneProduct(req,res);
});




export default productRouter;
