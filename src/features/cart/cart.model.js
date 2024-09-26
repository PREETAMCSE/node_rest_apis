

// cartId, productId, quantity
export default class CartItemModel{
    constructor(id,productId, userId, quantity){
         this.id=id;
         this.productId = productId;
         this.userId = userId;
         this.quantity = quantity;
    }

    static add(productId, userId, quantity){
        const cartItem = new CartItemModel(productId, userId, quantity);
        cartItem.id= cartItems.length+1;
        cartItems.push(cartItem);
        return cartItem;
    }

    static get(userId) {
        return cartItems.filter(
            (i) => i.userId == userId
        );
    }

    static delete(cartItemId, userId){
        const cartItemIndex = cartItems.findIndex(i => i.id == cartItemId && i.userId ==userId);
        console.log("Index found "+cartItemIndex);
        if(cartItemIndex== -1) {
            return 'Item not found';
        } else{
          cartItems.splice(cartItemIndex,1);
        }
    }
}

var cartItems = [
    new CartItemModel(1,1,2,1),
    new CartItemModel(2,1,1,2)
];