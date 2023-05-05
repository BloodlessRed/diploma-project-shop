<script setup lang="ts">
import Header from "./views/Header.vue";
import Footer from "./views/Footer.vue";
import { defineComponent } from "vue";
</script>

<template>
  <Header></Header>
  <router-view :key="$route.fullPath"></router-view>
  <Footer></Footer>
</template>

<script lang="ts">
export default defineComponent({
  data(){
    return{

    }
  }
})
</script>

<style>
/* Global styles */
html{
  font-family: 'Open Sans', sans-serif;
}
.item {
    width: min-content;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    margin: 0 20px 20px 20px;
    padding: 10px;
    background: #FFFFFF;
    box-shadow: 0px 1px 8px 5px rgba(0, 0, 0, 0.25);
    border-radius: 4px;
}
/* .to-product-box{
  background: #e5e5e5;
    border-radius: 4px;
    padding: 5px 10px;
} */

.custom-button {
  background-color: #2e75b6; /* Corporate blue */
  border: none;
  color: white; /* White text */
  border-radius: 4px;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
}

.custom-button:hover {
  background-color: #5c9bcf; /* Lighter blue */
}

.custom-button:active {
  background-color: #0a3f6c; /* Darker blue */
}

a{
  text-decoration: none;
}

.main-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 220px 4% 220px;
}
</style>