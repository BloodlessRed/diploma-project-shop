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

</style>