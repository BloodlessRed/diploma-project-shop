import { createRouter, createWebHistory } from 'vue-router'
import ProductsInCategory from '../views/ProductsInCategory.vue';
import MainPage from '../views/MainPage.vue';
import ProductPage from '../views/ProductPage.vue';
import ShoppingCart from '../views/ShoppingCart.vue';
import LoginPage from '../views/LoginPage.vue';
import ManagersPage from '../views/ManagersPage.vue';

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
      path:"/:category/:product_id", 
      name:"Product", 
      component: ProductPage, 
      props:true
    },
    {
      path:"/cart",
      name:"ShoppingCart",
      component: ShoppingCart
    },
    {
      path:"/login",
      name:"Login",
      component:LoginPage
    },
    {
      path:"/managers_page",
      name:"ManagersPage",
      component:ManagersPage
    }
  ]
})

export default router
