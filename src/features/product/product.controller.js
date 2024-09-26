import { ApplicationError } from "../../error-handler/applicationError.js";
import ProductModel from "./product.model.js";
import ProductRepository from "./product.repository.js";


export default class ProductController{

    constructor() {
        this.productRepository = new ProductRepository();
    }

    async getAllProducts(req,res){
        try {
            const product = await this.productRepository.getAll();
            res.status(200).send(product);
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong with db", 500);
          }
  
    }

    async addProduct(req,res){
        try{
       const { name, price, sizes, categories, description } = req.body;
       const newProduct = new ProductModel(name, description,parseFloat(price),
       req?.file?.filename,categories,sizes?.split(','));
       console.log(newProduct);
       const createdRecord = await this.productRepository.addUsingRelation(newProduct);
       res.status(201).send(createdRecord);
    }catch (error) {
        console.log(error);
        throw new ApplicationError("Something went wrong with db", 500);
      }
    }

    async rateProduct(req, res){
      const userId = req.userId;
      const productId = req.body.productId;
      const rating = req.body.rating;
      try{
      await this.productRepository.rateByRelation(userId,productId,rating);
      }catch(err) {
        return res.status(400).send(err.message);
      }
        return res.status(200).send("Ratings added");
    }

    async getOneProduct(req, res){
    
        try {
            const id = req.params.id;
            const product = await this.productRepository.get(id);
            if(!product){
                res.status(404).send("product not found");
            }else{
                return res.status(200).send(product);
            }
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong with db", 500);
          }
   
        
    }

    async filterProducts(req, res) {
        try{
        const minPrice = req.query.minPrice;
        const maxPrice = req.query.maxPrice;
        const categories = req.query.categories;
        const result = await this.productRepository.filterWithLogicalOperatorOrAndIn(minPrice,maxPrice,categories);
        res.status(200).send(result);
        }catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong with db", 500);
          }
    }

    async averagePrice(req,res,next){
       try{
        const avergaeResult = await this.productRepository.averageProductPricePerCategory()
        res.status(200).send(avergaeResult);
       }catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong with db", 500);
          }
    }
}