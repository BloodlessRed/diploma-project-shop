import { createRouter, createWebHistory } from 'vue-router'
import ProductsInCategory from '../views/ProductsInCategory.vue';
import MainPage from '../views/MainPage.vue';
import ProductPage from '../views/ProductPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path:"/", name:"Home", component: MainPage},
    {path:"/:categories*", name:"Category", component: ProductsInCategory},
    {path:"/:categories/:product", name:"Product", component: ProductPage}
  ]
})
//router.resolve({name: "categories*", params:{categories:["Nutrunners", "SecondaryMarket"]}})

export default router
