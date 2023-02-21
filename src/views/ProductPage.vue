<template >
    <div class="main-wrapper">
        <div class="product">
            <div class="img-container">
                <img src="" alt="">
            </div>
            <div class="product-info">
                <h3>{{ productName }}</h3>
                <p>Цена</p>
                <p>Категория</p>
                <p>Производитель</p>
                <p></p><!-- В наличии или нет -->
                <div class="button-section">
                    <button>Добавить в корзину</button>
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
    computed:{
        productName(): string{
            return this.$route.params.product.toString();
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
</style>