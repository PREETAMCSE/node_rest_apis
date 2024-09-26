
//1. import express
import express from 'express';

import { CartItemsController } from './cart.controller.js';




// 2. Initialize express router

const cartRouter = express.Router();

const cartController = new CartItemsController(); 

cartRouter.delete('/:id', (req,res, next)=>{
    cartController.delete(req,res, next);
});
cartRouter.post('/',(req,res, next)=>{
    cartController.add(req,res, next);
});
cartRouter.get('/',(req,res, next)=>{
    cartController.get(req,res, next);
});

export default cartRouter;