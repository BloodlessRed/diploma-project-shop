import { createRouter, createWebHistory } from 'vue-router'
import ProductsInCategory from '../views/ProductsInCategory.vue';
import MainPage from '../views/MainPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path:"/", name:"Home", component: MainPage},
    {path:"/:categories", component: ProductsInCategory}
  ]
})
//router.resolve({name: "categories*", params:{categories:["Nutrunners", "SecondaryMarket"]}})

export default router
