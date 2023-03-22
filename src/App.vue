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
.item {
    width: min-content;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    margin: 0 20px 20px 20px;
    padding: 10px;
    background: #FFFFFF;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 4px;
}

</style>