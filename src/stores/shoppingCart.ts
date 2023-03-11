import { defineStore } from "pinia";
import type { Product } from '@/model/Product';
import { ShoppingCartProduct } from "@/model/ShoppingCartProduct";

export const useShoppingCartStore = defineStore('shoppingCart',{
    state:()=>{
        return{
            cart:new Map<number,ShoppingCartProduct>()
        }
    },
    getters:{
        counter: (state) => {
            let counter = 0
            state.cart.forEach((value,key)=>{counter = counter + value.amount})
            return counter
        }
    },
    actions:{
        addToCart(item: Product){
            let id= undefined
            id = this.findItemInCart(item)
            if(id != undefined){
                let item = this.cart.get(id)
                if(item !=undefined){
                    item.amount++;
                }else{
                    alert("Item was not added to the cart. Please, try again!")
                }
            }else{
                this.cart.set(item.id,new ShoppingCartProduct(item,1))
            }
        },
        removeFromCart(item: Product){
            let id= undefined
            id = this.findItemInCart(item)
            if(id != undefined){
                let item = this.cart.get(id)
                if(item !=undefined){
                    item.amount--;
                    if(item.amount <= 0 && confirm("")){
                        
                    }
                }else{
                    alert("Item was not in the cart. Please, try again!")
                }
            }
        },
        findItemInCart(item:Product):number | undefined{
            console.log("Item passed is:", item)
            let id = undefined
            this.cart.forEach((value,key)=>{
                console.log(value.product)
                if (item.id == value.product.id){
                    id = key
                }
            })
            return id;
        }
    }
})