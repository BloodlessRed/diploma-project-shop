<template >
    <div class="main-wrapper">
        <div class="product">
            <div class="img-container">
                <img :src="`../img/${product.img}-Nutrunners.svg`" alt="">
            </div>
            <div class="product-info">
                <h1>{{ product.vendorCode }}</h1>
                <p>Описание: {{ product.name }}</p>
                <p>Цена: {{ product.price }}</p>
                <p>Категория: <router-link :to="{name: 'Manufacturer', params:{manufacturer:cmptd_product_category}}">{{ cmptd_product_category }}</router-link></p>
                <p>Производитель:</p>
                <p></p><!-- В наличии или нет -->
                <div class="button-section">
                    <button @click="addToShoppingCart()">Добавить в корзину</button>
                    <button>Получить взрыв-схему</button>
                </div>
            </div>
        </div>
        <h3 color="#0055D3">Похожие продукты</h3>
        <div class="similar-products">
            <div class="item" v-for="item in similarProducts">
                <img :src="`../img/${item.img}-Nutrunners.svg`" />
        <p>{{ item.name }}</p>
        <router-link
          :to="{
            name: 'Product',
            params: { category: cmptd_product_category, product_id: item.id },
          }"
        >
          <div class="to-product-box">
            <p>Read more</p>
          </div>
        </router-link>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { Product } from '@/model/Product';
import { useShoppingCartStore } from '@/stores/shoppingCart'
import axios from 'axios';
export default defineComponent({
    props:{
        product_id:{
            type: String,
            default:-1
        },
        category:{
            type:String,
            default:"no category"
        }
    },
    computed:{
        cmptd_product_category():string{
            return this.category;
        }
    },
    data(){
        return{
            product: new Product(),
            similarProducts: [] as Product[],
            shoppingCart: useShoppingCartStore()
        }
    },
    mounted() {
        let url:string = "https://my-json-server.typicode.com/BloodlessRed/diploma-project-json-server/"+this.category+"/"+this.product_id 
        axios.get(url)
                .then(res=>{return res.data as Promise<Product>})
                .then(data=>{console.log(data); this.product = data;}) 
                .then(()=>{ url = "https://my-json-server.typicode.com/BloodlessRed/diploma-project-json-server/"+this.category.toString()+"/?vendorCode_like="+this.product.img
        axios.get(url)
        .then(res=>{return res.data as Promise<Product[]>})
        .then(data=>{console.log(data,); this.similarProducts = data})    
        })       
    },
    methods:{
        addToShoppingCart(){
            console.log(this.product)
          this.shoppingCart.addToCart(this.product)
        }
    }
})
</script>
<style scoped>
.main-wrapper {
    display: flex;
    flex-direction: column;
    /* justify-content: stretch; */
    padding: 220px
}
.product{
    display: flex;
    justify-content: center;
    align-self: center;
}
.product-info {
    width: 50%;
    margin-bottom: 5%;
}
.product-info > p{
    font-size: 17px;
    line-height: 1.3;
}
.item > img{
    width: 200px;
}
.img-container{
    margin: 0 50px;
}
.img-container > img{
    height: 250px;
    width: 250px;
}
.similar-products{
    display: flex;
}
</style>