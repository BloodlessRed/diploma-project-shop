import { Product } from "./Product";

export class ShoppingCartProduct{
    product:Product
    amount:number
    
    constructor(product?:Product, amount?:number){
        if(product && amount){
            this.product = product;
            this.amount = amount
        }else{
            this.product = new Product();
            this.amount = -1
        }
        
    }

    equals(o:ShoppingCartProduct):boolean{
        return o.product.equals(this.product)
    }
}