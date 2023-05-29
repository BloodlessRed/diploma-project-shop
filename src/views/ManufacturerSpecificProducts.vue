<template>
  <div class="product-specific-wrapper" ref="loaderAnchor">
    <div class="products">
      <ProductCard
        v-for="(product, index) in cmptd_category"
        :key="index"
        :product="product"
      >
      </ProductCard>
    </div>
    <div class="search-box">
      <div class="filter">
        <h3>Категории товаров</h3>
        <ul class="category-list">
          <li v-for="(category, index) in filters" :key="index">
            <input
              type="checkbox"
              :id="category + index"
              :value="category"
              v-model="selectedCategories"
            />
            <label :for="category + index"
              >{{ category }}</label
            >
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, inject } from "vue";
import type { SupabaseClient } from "@supabase/supabase-js";
import ProductCard from "./ProductCard.vue";
import { Product } from "@/model/Product";
export default defineComponent({
  components: {
    ProductCard,
  },
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
      if (this.selectedCategories.length > 0) {
        let filtered_products: unknown[] = [];
        filtered_products = this.products.filter((item) => {
          return this.selectedCategories.includes(item.category);
        });
        console.log(this.selectedCategories, filtered_products);
        return filtered_products;
      }
      return this.products;
    },
  },
  data() {
    return {
      products: [] as Product[],
      filters: [] as any[],
      selectedCategories: [] as string[],
    };
  },
  async mounted() {
    if (this.supabase == undefined) {
      return;
    }
    let loader = this.$loading.show({
      active: true,
      zIndex: 3,
      isFullPage: false,
      container: this.$refs.loaderAnchor as HTMLElement,
      color: "#2e75b6",
    });
    await this.supabase
      .from("full_products")
      .select(
        `*`
      )
      .eq("manufacturer", this.manufacturer)
      .then((value) => {
        console.log(value);
        if (value.data != null) {
          value.data.map((item) => {
            this.products.push(
              new Product(
                item.id,
                item.description,
                item.manufacturer,
                item.category,
                item.vendor_code,
                item.price,
                item.img
              )
            );
          });
        }
      });
    await this.supabase
      .from("distinct_categories_for_manufacturers")
      .select("category")
      .eq("manufacturer", this.manufacturer)
      .then((value) => {
        if (value.data != null) {
          this.filters = value.data.map((elem)=>{
            return elem.category
          });
        }
      });
    loader.hide();
  },
});
</script>
<style scoped>
.product-specific-wrapper {
  display: flex;
  position: relative;
  /* justify-content: stretch; */
  width: 80%;
}

.products {
  display: flex;
  align-content: flex-start;
  flex-wrap: wrap;
  flex-grow: 1;
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
  border-top: 1px solid #2e75b6;
  border-radius: 5px;
  padding: 0px 10px 3px 10px;
  font-family: "Open Sans", sans-serif;
  font-size: 18px;
  color: #333;
}

.category-list {
  list-style: none;
  padding: 8px;
}
.category-list li {
  display: flex;
  align-items: center;
  width: max-content;
  font-family: "Open Sans", sans-serif;
  font-size: 16px;
  color: #333;
}
input[type="checkbox"] {
  width: 1rem;
  height: 1rem;
}
</style>
