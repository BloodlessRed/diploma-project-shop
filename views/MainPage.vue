<template>
    <Header></Header>
    <div class="main-wrapper">
        <div class="introduction">
            <p>{{ introduction }}</p>
        </div>
        <div class="category-block">
            <div class="category" >
                <router-link v-for="category in categories" :to="{name: 'Category', params:{category:category.name}}">
                    <span>
                        {{ category.name }}
                    </span>
                    <img :src="`./img/${category.src}`">
                </router-link>
            </div>
        </div>
    </div>
</template>
<script lang="ts" scoped>
import { defineComponent } from 'vue';
import { RouterLink } from 'vue-router';

export default defineComponent({
    data() {
        return {
            introduction: 'Добро пожаловать в магазин компании. Здес мы продаем инструменты и запчасти от различных поставщиков для сборочного процесса',
            categories: [
                {
                    name: "Nutrunners",
                    src: "category1.svg"
                },
                {
                    name: "SecondaryMarket",
                    src: "category1.svg"
                },
                {
                    name: "category3",
                    src: "category1.svg"
                }
            ]
        }
    }
})
</script>
<style scoped>
.main-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0px 220px
}

.main-wrapper * {
    width: 100%;
}

img {
    max-width: fit-content;
}

.introduction {
    display: flex;
}

.introduction:first-child {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 24px;
    line-height: 28px;
}

.slider {
    flex-grow: 1;
}

.category-block {
    display: flex;
    justify-content: space-evenly;
}

.category {
    display: flex;
    justify-content: flex-start;

}

.category p {
    max-width: calc(10% + 5px);
}
.category a {
    width: fit-content;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}
span{
    margin:0 10px;
}
</style>