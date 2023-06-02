import { createRouter, createWebHistory } from 'vue-router'
import ManufacturerSpecificProducts from '../views/ManufacturerSpecificProducts.vue';
import MainPage from '../views/MainPage.vue';
import ProductPage from '../views/ProductPage.vue';
import ShoppingCart from '../views/ShoppingCart.vue';
import LoginPage from '../views/LoginPage.vue';
import ManagersPage from '../views/ManagersPage.vue';
import ClientsPage from '../views/ClientsPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:"/", 
      component: MainPage,
      redirect:{name:'Manufacturer', params:{manufacturer:'makita'}},
      children:[
        {
          path:"/:manufacturer", 
          name:"Manufacturer", 
          component: ManufacturerSpecificProducts, 
          props:true
        }
      ]
    },
    {
      path:"/product_page/:product_id?", 
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
      path:"/user_account/manager/",
      name:"ManagersPage",
      component:ManagersPage
    },
    {
      path:"/user_account/",
      name:"ClientsPage",
      component:ClientsPage
    }
  ]
})

export default router
