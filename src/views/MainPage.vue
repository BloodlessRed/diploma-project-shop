<template>
    <div class="main-wrapper">
        <div class="introduction">
            <p>{{introduction}}</p>
        </div>
        <div class="categories">
            <h1>STUB</h1>
        </div>
        <div class="site-description">
            <h1>STUB</h1>
        </div>
        <div class="contact-request">
            <h1>STUB</h1>
        </div>
    </div>
</template>
<script lang="ts">
export default {
    data(){
        return{
            introduction: 'Добро пожаловать в магазин компании. Здес мы продаем инструменты и запчасти от различных поставщиков для сборочного процесса'
        }
    }
}
</script>
<style>
.main-wrapper{
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0px 220px
}
.main-wrapper * {
    width: 100%;
}
.introduction{
    display: flex;
}
.introduction:first-child{
    font-family: 'Roboto';
font-style: normal;
font-weight: 400;
font-size: 24px;
line-height: 28px;
}
.slider{
    flex-grow: 1;
}
</style>