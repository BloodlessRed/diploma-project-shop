<template >
    <div class="main-wrapper">
        <div class="product">
            <div class="img-container">
                <img src="" alt="">
            </div>
            <div class="product-info">
                <h3>{{ cmptd_product_name }}</h3>
                <p>Цена</p>
                <p>Категория: {{ cmptd_product_category }}</p>
                <p>Производитель</p>
                <p></p><!-- В наличии или нет -->
                <div class="button-section">
                    <button @click="$emit('addToCart')">Добавить в корзину</button>
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

export default defineComponent({
    emits:["addToCart"],
    props:{
        product:
        {
            type:String,
            default:"no name selected"
        },
        category:{
            type:String,
            default:"no category"
        }
    },
    computed:{
        cmptd_product_name(): string{
            return this.product;
        },
        cmptd_product_category():string{
            return this.category;
        }
    },
    data(){
        return{

        }
    },
    methods:{

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