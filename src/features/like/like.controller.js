import { LikeRepository } from "./like.repository.js";


export class LikeController {

    constructor(){
        this.likeRepository = new LikeRepository();
    }

    async likeItem(req, res, next){
        try{
          const {id, type} = req.body;
          const userId = req.userId;   
          if(type != 'Product' && type != 'Category'){
            return res.status(400).send('Invalid Types');
          }
          if(type=='Product'){
              this.likeRepository.likeProduct(userId, id);
          }else{
             this.likeRepository.likeCategory(userId, id);
          }
          return res.status(200).send("likes added");
        }catch (error) {
        console.log(error);
        throw new ApplicationError("Something went wrong with db", 500);
      }
    }

    async getLikes(req,res,next){
        try {
            const {id, type} =req.query;
            const likes = await this.likeRepository.getLikes(type, id);  
            return res.status(200).send(likes);
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong with db", 500);
        }
    }
}