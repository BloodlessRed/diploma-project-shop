<template >
    <div class="main-wrapper">
        <div class="product">
            <div class="img-container">
                <img :src="`../img/${product.img}`" alt="">
            </div>
            <div class="product-info">
                <h1>{{ product.name }}</h1>
                <p>Цена:</p>
                <p>Категория: {{ cmptd_product_category }}</p>
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
            <div class="item">

            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { Product } from '@/model/Product';
import { useShoppingCartStore } from '@/stores/shoppingCart'
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
            shoppingCart: useShoppingCartStore()
        }
    },
    mounted() {
        fetch( "https://my-json-server.typicode.com/BloodlessRed/diploma-project-json-server/"+this.category.charAt(0).toLowerCase() + this.category.slice(1)+"/"+this.product_id)
                .then(res=>{return res.json() as Promise<Product>})
                .then(data=>{console.log(data); this.product = data})
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
    height: 100%;
    display: flex;
    flex-direction: column;
    /* justify-content: stretch; */
    padding: 220px
}
.product{
    display: flex;
    justify-content: center;
}
.product-info > p{
    font-size: 17px;
    line-height: 1.3;
}
.img-container{
    height: 80%;
    width: 50%;
}
.img-container > img{
    height: 100%;
    width: 100%;
}
</style>