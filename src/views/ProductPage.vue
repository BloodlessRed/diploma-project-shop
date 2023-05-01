<template>
  <div class="main-wrapper">
    <div class="product">
      <div class="img-container">
        <img :src="`../img/${product.img}-Nutrunners.svg`" alt="" />
      </div>
      <div class="product-info">
        <h1>{{ product.vendorCode }}</h1>
        <p>Описание: {{ product.description }}</p>
        <p>Цена: {{ formatPrice(product.price) }}</p>
        <p>Категория: {{ product.category }}</p>
        <p>
          Производитель:
          <router-link
            :to="{
              name: 'Manufacturer',
              params: { manufacturer: product.manufacturer },
            }"
            >{{ product.manufacturer }}</router-link
          >
        </p>
        <!-- В наличии или нет -->
        <div class="button-section">
          <button @click="addToShoppingCart()">Добавить в корзину</button>
          <button>Получить взрыв-схему</button>
        </div>
      </div>
    </div>
    <h3 color="#0055D3">Похожие продукты</h3>
    <div class="similar-products">
      <div class="item" v-for="item in similarProducts">
        <img :src="`../img/${item.img}-Nutrunners.svg`" />
        <p>{{ item.vendorCode }}</p>
        <router-link
          :to="{
            name: 'Product',
            params: { category: item.category, product_id: item.id },
          }"
        >
          <div class="to-product-box">
            <span>Подробнее</span>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, inject } from "vue";
import { Product } from "@/model/Product";
import { useShoppingCartStore } from "@/stores/shoppingCart";
import type { SupabaseClient } from "@supabase/supabase-js";
export default defineComponent({
  props: {
    product_id: {
      type: String,
      default: -1,
    },
    category: {
      type: String,
      default: -1,
    },
  },
  setup() {
    const supabase: SupabaseClient | undefined = inject("supabase");
    return {
      supabase,
    };
  },
  data() {
    return {
      product: new Product(),
      similarProducts: [] as Product[],
      shoppingCart: useShoppingCartStore(),
    };
  },
  mounted() {
    if (this.supabase == undefined) {
      return;
    }
    this.supabase
      .from("Products")
      .select(`*, Categories(code)`)
      .eq("id", this.product_id)
      .then((value) => {
        if (value == null) {
          return;
        }
        let current_product = value.data?.map((item) => {
          return new Product(
            item.id,
            item.description,
            item.manufacturer,
            item.Categories.code,
            item.vendor_code,
            item.price,
            item.img
          );
        })[0];
        current_product != undefined
          ? (this.product = current_product)
          : undefined;
      });
    this.supabase
      .from("Products")
      .select(`*, Categories!inner(code)`)
      .eq("Categories.code", this.category)
      .then((value) => {
        console.log("Affiliated products are ", value);
        value.data?.map((item) => {
          if (item.Categories.code != null && item.id != this.product_id) {
            this.similarProducts.push(
              new Product(
                item.id,
                item.description,
                item.manufacturer,
                item.Categories.code,
                item.vendor_code,
                item.price,
                item.img
              )
            );
          }
        });
      });
  },
  methods: {
    addToShoppingCart() {
      console.log(this.product);
      this.shoppingCart.addToCart(this.product);
    },
    formatPrice(price: number): string {
      return Intl.NumberFormat("ru-RU", { useGrouping: true }).format(price);
    },
  },
});
</script>
<style scoped>
.main-wrapper {
  display: flex;
  flex-direction: column;
  /* justify-content: stretch; */
  padding: 220px;
}
.product {
  display: flex;
  justify-content: center;
  align-self: center;
}
.product-info {
  width: 50%;
  margin-bottom: 5%;
}
.product-info > p {
  font-size: 17px;
  line-height: 1.3;
}
.item > img {
  width: 200px;
}
.img-container {
  margin: 0 50px;
}
.img-container > img {
  height: 250px;
  width: 250px;
}
.similar-products {
  display: flex;
}
</style>
