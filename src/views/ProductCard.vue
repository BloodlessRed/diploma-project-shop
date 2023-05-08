<template>
  <div class="item">
    <img :src="`./img/${passed_product.img}-Nutrunners.svg`" />
    <h3>{{ passed_product.vendorCode }}</h3>
    <router-link
      :to="{
        name: 'Product',
        params: {
          product_id: passed_product.vendorCode,
        },
      }"
    >
      <div class="custom-button">
        <span>Подробнее</span>
      </div>
    </router-link>
  </div>
</template>
<script lang="ts">
import { Product } from "@/model/Product";
import { defineComponent } from "vue";

export default defineComponent({
  props: ["product"],
  computed: {
    passed_product() {
      if (this.product != undefined) {
        return this.product;
      } else {
        return new Product();
      }
    },
  },
});
</script>
<style scoped>
.item img {
  height: 300px;
  width: 300px;
}

.item p {
  font-family: "Noto Sans";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  /* line-height: 19px; */
  margin: 0;
  text-align: center;
  outline: none;
  color: #000000;
}
.item a {
  text-decoration: none;
}
/* .item div:last-child {
  background: #e5e5e5;
  border-radius: 4px;
  padding: 5px 10px;
} */
</style>
