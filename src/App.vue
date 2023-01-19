<script setup lang="ts">
import Header from "./views/Header.vue";
import MainPage from "./views/MainPage.vue";
import Footer from "./views/Footer.vue";
</script>

<template>
  <Header></Header>
  <router-view :key="$route.fullPath"></router-view>
  <Footer></Footer>
</template>

<style>
/* Global styles */
.item {
    height: fit-content;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 20px 20px 20px;
    padding: 10px;
    background: #FFFFFF;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 4px;
}

</style>