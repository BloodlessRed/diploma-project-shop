import { defineStore, type StateTree } from "pinia";
import type { Product } from '@/model/Product';
import { ShoppingCartProduct } from "@/model/ShoppingCartProduct";
import {parse, stringify} from 'zipson'

export const useShoppingCartStore = defineStore('shoppingCart',{
    state:()=>{
        return{
            cart:new Map<number,ShoppingCartProduct>()
        }
    },
    getters:{
        counter: (state) => {
            let counter = 0
            console.log("counter",state.cart)
            state.cart.forEach((value,key)=>{counter = counter + value.amount})
            return counter
        },
        entries:(state)=>{
            return state.cart.entries()
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
                this.cart.set(this.cart.size,new ShoppingCartProduct(item,1))
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
            console.log("this.cart equals",this.cart)
            this.cart.forEach((value,key)=>{
                console.log(value.product)
                if (item.id == value.product.id){
                    id = key
                }
            })
            return id;
        }
    },
    persist:{
        storage:sessionStorage,
        paths:["cart"],
        afterRestore(context) {
            console.log("After restoration ",context)
        },
        serializer:{
           serialize:(value)=> {
            console.log("StateTree example", value)
                let customMap:[{id:number, customProduct:{product:Product,amount:number}}] = []
                value.cart.forEach((value:ShoppingCartProduct,key:number) => {
                    customMap.push({
                        id:key,
                        customProduct:{
                            product:value.product,
                            amount:value.amount
                        }
                    })
                });
               console.log("serealizing cart", customMap)
               return stringify(customMap)
           },
           deserialize:(value)=> {
                let newStateTree: StateTree = {
                    cart: new Map<number,ShoppingCartProduct>
                };
               let deserializedMap = new Map<number,ShoppingCartProduct>()
               let parsedString = []
               parsedString = parse(value)
               parsedString.forEach(element => {
                let tempShoppingCartProduct:ShoppingCartProduct = new ShoppingCartProduct(element.customProduct.product,element.customProduct.amount)
                deserializedMap.set(element.id, tempShoppingCartProduct)
               });
               newStateTree.cart = deserializedMap
               console.log(deserializedMap)
               return newStateTree
           },
        }
    }
})