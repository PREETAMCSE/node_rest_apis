import CartItemModel from "./cart.model.js";
import CartRepository from "./cart.repository.js";

export class CartItemsController {

    constructor() {
        this.cartRepository = new CartRepository();
    }

    async add(req, res) {
        try{
        const { productID, quantity } = req.body;
        const userId = req.userId;
        await this.cartRepository.add(productID,userId,quantity);
        res.status(201).send("Cart is updated");
        }catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong with db", 500);
          }
    }

    async get(req, res){
        try{
        const userId = req.userId;
        const cartItem = await this.cartRepository.get(userId);
        return res.status(200).send(cartItem);
        }catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong with db", 500);
          }
    }

    async delete(req,res){
        try{
        const userId = req.userId;    
        const cartItemId = req.params.id;
        const isDeleted = await this.cartRepository.delete(cartItemId,userId);
        if(!isDeleted){
            return res.status(404).send("Cart item not found");
        }
        return res.status(200).send("Cart item removed");
    }catch (error) {
        console.log(error);
        throw new ApplicationError("Something went wrong with db", 500);
      }
    }
}