import { defineStore } from "pinia";

export const useShoppingCartStore = defineStore('shoppingCart',{
    state:()=>{
        return{
            cart:[]
        }
    },
    getters:{
        counter: (state) => {return state.cart.length}
    },
    actions:{
        addToCart({})
    }
})