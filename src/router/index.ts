import { createRouter, createWebHistory } from 'vue-router'
import ProductsInCategory from '../views/ProductsInCategory.vue';
import MainPage from '../views/MainPage.vue';
import ProductPage from '../views/ProductPage.vue';
import ShoppingCart from '../views/ShoppingCart.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:"/", 
      name:"Home", 
      component: MainPage
    },
    {
      path:"/:category", 
      name:"Category", 
      component: ProductsInCategory, 
      props:true
    },
    {
      path:"/:category/:product", 
      name:"Product", 
      component: ProductPage, 
      props:true
    },
    {
      path:"/cart",
      name:"ShoppingCart",
      component: ShoppingCart
    }
  ]
})

export default router
