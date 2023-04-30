<template>
  <div v-if="products.length > 0" class="product-specific-wrapper">
    <div class="products">
      <div class="item" v-for="product in cmptd_category">
        <img :src="`./img/${product.img}-Nutrunners.svg`" />
        <h3>{{ product.vendor_code }}</h3>
        <router-link
          :to="{
            name: 'Product',
            params: { category: categoryName, product_id: product.id },
          }"
        >
          <div class="to-product-box">
            <p>Подробнее</p>
          </div>
        </router-link>
      </div>
    </div>
    <div class="search-box">
      <img :src="`./img/manufacturer-line.svg`" />
      <div class="filter">
        <h3>Категории</h3>
        <ul class="category-list">
          <li v-for="category in filters">
            <input
              type="checkbox"
              :value="category.code"
              v-model="selectedCategories"
            />
            {{ category.code }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, inject } from "vue";
import type { SupabaseClient } from "@supabase/supabase-js";
export default defineComponent({
  props: {
    manufacturer: {
      type: String,
      default: "no category selected",
    },
  },
  setup() {
    const supabase: SupabaseClient | undefined = inject("supabase");
    return {
      supabase,
    };
  },
  computed: {
    cmptd_category(): any[] {
      // console.log(this.products);
      if(this.selectedCategories.length > 0){
        let filtered_products: unknown[] = []
        filtered_products = this.products.filter((item)=>{
          return this.selectedCategories.includes(item.Categories.code)
        })
        console.log(this.selectedCategories,filtered_products)
        return filtered_products
      }
      return this.products;
    },
    categoryName(): string {
      console.log(this.$route.params);
      return this.manufacturer;
    },
  },
  data() {
    return {
      products: [] as any[],
      filters: [] as any[],
      selectedCategories:[] as string[]
    };
  },
  mounted() {
    if (this.supabase == undefined) {
      return;
    }
    this.supabase
      .from("Products")
      .select(
        `id, description,price,manufacturer,img,vendor_code,
        Categories (
          code
        )`
        )
      .eq("manufacturer", this.manufacturer)
      .then((value) => {
        console.log(value)
        if (value.data != null) {
          this.products = value.data;
        }
      });
    this.supabase
      .from("distinct_categories_for_manufacturers")
      .select("code")
      .eq("manufacturer", this.manufacturer)
      .then((value) => {
        if (value.data != null) {
          this.filters = value.data;
        }
      });
  },
});
</script>
<style scoped>

.product-specific-wrapper {
  display: flex;
  /* justify-content: stretch; */
  padding: 50px 220px;
}

.products {
  display: flex;
  align-content: flex-start;
  flex-wrap: wrap;
  flex-grow: 1;
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
  margin: 0;
  text-align: center;
  outline: none;
  color: #000000;
}
.item a {
  text-decoration: none;
}
.item div:last-child {
  background: #e5e5e5;
  border-radius: 4px;
  padding: 5px 10px;
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
  font-family: 'Open Sans', sans-serif; 
  font-size: 18px; 
  color: #333; 
} 

.category-list {
  list-style: none;
}
.category-list li {
  font-family: 'Open Sans', sans-serif; 
  font-size: 16px; 
  color: #333; 
}
</style>
