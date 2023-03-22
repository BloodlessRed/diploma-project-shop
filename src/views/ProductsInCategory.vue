<template>
  <div class="main-wrapper">
    <div class="products">
      <div class="item" v-for="product in cmptd_category">
        <img :src="`./img/${product.img}-Nutrunners.svg`" />
        <p>{{ product.name }}</p>
        <router-link
          :to="{
            name: 'Product',
            params: { category: categoryName, product_id: product.id },
          }"
        >
          <div class="to-product-box">
            <p>Read more</p>
          </div>
        </router-link>
      </div>
    </div>
    <div class="search-box">
      <img :src="`./img/manufacturer-line.svg`" />
      <div class="filter">
        <h3>Производитель</h3>
        <ul>
          <li>Атлас</li>
          <li>GSE</li>
          <li>Ingersoll</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import axios from 'axios'
export default defineComponent({
  props: {
    category: {
      type: String,
      default: "no category selected",
    },
  },
  computed: {
    cmptd_category(): any[] {
      console.log(this.category);
      let routeParameter: string = this.category;
      let products: any = [];
      if (routeParameter == "nutrunners") {
        console.log(this.products);
        return this.products;
      } else if (routeParameter == "SecondaryMarket") {
        return [
          {
            id: 1,
            img: "cable-pic-proto.svg",
            name: "Second market Atlas Copco 4220-0982-15 15 meter Cable",
            prodLink: "STUB",
          },
          {
            id: 2,
            img: "cable-pic-proto.svg",
            name: "Second market Atlas Copco 4220-0982-15 15 meter Cable",
            prodLink: "STUB",
          },
          {
            id: 3,
            img: "cable-pic-proto.svg",
            name: "Second market Atlas Copco 4220-0982-15 15 meter Cable",
            prodLink: "STUB",
          },
        ];
      }
      return [{ id: 0, img: "null", name: "null", prodLink: "null" }];
    },
    categoryName(): string {
      console.log(this.$route.params);
      return this.category;
    },
  },
  data() {
    return {
      products: [],
    };
  },
  mounted() {
    axios.get("https://my-json-server.typicode.com/BloodlessRed/diploma-project-json-server/" +this.category)
      .then((res) => {
        this.products = res.data;
      })
  },
});
</script>
<style scoped>
.main-wrapper {
  display: flex;
  /* justify-content: stretch; */
  padding: 50px 220px;
}

.products {
  display: flex;
  align-content: flex-start;
  flex-wrap: wrap;
}

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

  text-align: center;

  color: #000000;
}

.item div:last-child {
  background: #e5e5e5;
  border-radius: 4px;
}

.search-box {
  height: fit-content;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 24px;
  isolation: isolate;

  background: #ffffff;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25),
    inset 0px 0px 4px rgba(0, 0, 0, 0.25);
}

.filter {
  padding: 0px 0px 3px 10px;
}
</style>
