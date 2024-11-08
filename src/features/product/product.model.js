import { ApplicationError } from "../../error-handler/applicationError.js";
import UserModel from "../user/user.model.js";


export default class ProductModel{

    constructor(name, desc,price, imageUrl, category, sizes,id){
        this._id=id;
        this.name=name;
        this.desc=desc;
        this.price=price;
        this.imageUrl=imageUrl;
        this.category=category;
        this.sizes = sizes;
    }

    static get(id){
        const product = products.find(i=>i.id==id);
        return product;
    }

    static getAll(){
        return products;
    }

    static add(product){
        product.id= products.length+1;
        products.push(product);
        return product;
    }

    static filter(minPrice, maxPrice, category){
        const result = products.filter((product)=>{
            return (
                (!minPrice ||product.price>=minPrice) && (!maxPrice || product.price<=maxPrice)
            && (!category || product.category == category)
            );
        });
        return result;
    }

    static rateProduct(userId, productId, rating){
        // 1. Validate user and product
        const user = UserModel.getAll().find(
            (u) => u.id == userId
        );
        if(!user){
            throw new ApplicationError('User not found', 400);
        }
        
      // 2. Validate Product
      const product = products.find( p => p.id==productId);
      if(!product){
        // User defined error
        throw new ApplicationError('Product not found', 400);
      }

      //3. Check if there are any ratings and if not add ratings array
      if(!product.ratings){
        product.ratings = [];
        product.ratings.push({userId : userId, rating: rating});
      }else{
        // check if user rating is already present
        const existingRatingIndex = product.ratings.findIndex(
            (r) => r.userId == userId
        );
        if(existingRatingIndex>=0){
            product.ratings[existingRatingIndex] = {
                userId : userId,
                rating: rating,
            };
        }else {
            product.ratings.push({userId : userId, rating: rating});
        }
      }

    }

}

var products = [
    new ProductModel(
      1,
      'Product 1',
      'Description for Product 1',
      19.99,
      'https://m.media-amazon.com/images/I/51-nXsSRfZL.SX328_BO1,204,203,200.jpg',
      'Category1',
    ),
    new ProductModel(
      2,
      'Product 2',
      'Description for Product 2',
      29.99,
      'https://m.media-amazon.com/images/I/51xwGSNX-EL.SX356_BO1,204,203,200.jpg',
      'Category1',
      ['M','XL'],
    ),
    new ProductModel(
      3,
      'Product 3',
      'Description for Product 3',
      39.99,
      'https://m.media-amazon.com/images/I/31PBdo581fL.SX317_BO1,204,203,200.jpg',
      'Category1',
      ['M','XL','S'],
    ),
  ]