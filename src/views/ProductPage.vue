<template>
  <div class="main-wrapper">
    <div class="product">
      <div class="img-container">
        <img :src="`../img/${product.img}-Nutrunners.svg`" alt="" />
      </div>
      <div class="product-info">
        <h1>{{ product.vendorCode }}</h1>
        <p>Описание: {{ product.description }}</p>
        <p>Цена: {{ shoppingCart.formatPrice(product.price) }} rub</p>
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
          <div class="custom-button" @click="addToShoppingCart()">
            Добавить в корзину
          </div>
          <div
            v-if="hasSchema"
            class="custom-button"
            @click="downloadExplosionSchema(product.vendorCode)"
          >
            Получить взрыв-схему
          </div>
        </div>
      </div>
    </div>
    <div class="similar-products-wrapper" v-if="similarProducts.length > 0">
      <h3 color="#0055D3">Похожие продукты</h3>
      <div class="similar-products">
        <div class="item" v-for="item in similarProducts">
          <img :src="`../img/${item.img}-Nutrunners.svg`" />
          <p>{{ item.vendorCode }}</p>
          <router-link
            :to="{
              name: 'Product',
              params: { product_id: item.vendorCode },
            }"
          >
            <div class="custom-button">
              <span>Подробнее</span>
            </div>
          </router-link>
        </div>
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
    }
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
      hasSchema: true,
    };
  },
  async mounted() {
    if (this.supabase == undefined) {
      return;
    }
    console.log("current vendor code", this.product_id.toLocaleUpperCase())
    await this.supabase
      .from("Products")
      .select(`*, Categories(code)`)
      .ilike("vendor_code", "%"+this.product_id+"%")
      .then((value) => {
        console.log(value)
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
      })
      .then(() => {
        console.log(this.product.vendorCode);
        fetch("/explosion_schemas/" + this.product.vendorCode + ".pdf").then(
          (response) => {
            if (!(response.status >= 200 && response.status < 300)) {
              this.hasSchema = false;
            }
          }
        );
      });
    this.supabase
      .from("Products")
      .select(`*, Categories!inner(code)`)
      .eq("Categories.code", this.product.category)
      .then((value) => {
        console.log("Affiliated products are ", value);
        value.data?.map((item) => {
          if (item.Categories.code != null && item.id != this.product.id) {
            console.log("ID - ",this.product.id)
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
    downloadExplosionSchema(name: string) {
      fetch("/explosion_schemas/" + name + ".pdf")
        .then((value) => {
          console.log(value);
          return value.blob();
        })
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = name + "_schema.pdf";
          link.click();
          window.URL.revokeObjectURL(url);
        })
        .catch((error) => (this.hasSchema = false));
    },
  },
});
</script>
<style scoped>
.main-wrapper {
  justify-content: center;
  align-self: center;
  width: 50%;
  padding: 50px 220px;
}
.product {
  display: flex;
  justify-content: center;
  align-self: center;
  width: 100%;
  margin-bottom: 5%;
  padding: 10px 0;
  border-radius: 5px;
  box-shadow: 0px 0px 10px 10px rgba(0, 0, 0, 0.25);
}
.product-info {
  width: 50%;
}
.product-info > p {
  word-break: break-all;
  white-space: normal;
  font-size: 17px;
  line-height: 1.3;
}
.item > img {
  width: 200px;
}
.img-container {
  margin: 0 50px;
  display: flex;
  align-items: center;
}
.img-container > img {
  height: 250px;
  width: 250px;
}
.similar-products {
  display: flex;
  justify-content: center;
}

.product .custom-button {
  margin-right: 5px;
}

.similar-products-wrapper {
  width: 100%;
  padding: 5px 0;
  border-radius: 5px;
  box-shadow: 0px 0px 2px 2px rgba(0, 0, 0, 0.25);
}
.similar-products-wrapper > h3 {
  text-align: center;
}
</style>
