<template >
    <div class="main-wrapper">
        <div class="product">
            <div class="img-container">
                <img src="" alt="">
            </div>
            <div class="product-info">
                <h3>{{ product.name }}</h3>
                <p>Цена</p>
                <p>Категория: {{ cmptd_product_category }}</p>
                <p>Производитель</p>
                <p></p><!-- В наличии или нет -->
                <div class="button-section">
                    <button @click="">Добавить в корзину</button>
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
import {useCounterStore} from '@/stores/counter'

export default defineComponent({
    emits:["addToCart"],
    props:{
        prod_id:{
            type: Number,
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
            product:{
                id:-1,
                name:"",
                img:"",
                prodLink:""
            }
        }
    },
    mounted() {
        fetch("http://localhost:3000/"+this.category.charAt(0).toLowerCase() + this.category.slice(1)+"/"+this.prod_id)
                .then(res=>{return res.json()})
                .then(data=>{console.log(data); this.product = data})
    },
    methods:{
        addToShoppingCart(){
            
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
</style>