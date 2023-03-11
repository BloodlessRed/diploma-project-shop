import type { Product } from "./Product";

export class ShoppingCartProduct{
    product:Product
    amount:number
    
    constructor(product:Product, amount:number){
        this.product = product;
        this.amount = amount
    }

    equals(o:ShoppingCartProduct):boolean{
        return o.product.equals(this.product)
    }
}