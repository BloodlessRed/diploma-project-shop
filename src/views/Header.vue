<template>
  <div class="header">
    <div class="logo">
      <img :src="`/img/header-logo.svg`" />
    </div>
    <div class="line">
      <div class="button-space">
        <router-link :to="{ path: '/' }">Категории</router-link>
        <div class="search-wrapper">
          <input
            class="search-bar"
            type="text"
            placeholder="Введите артикул товара"
            @keydown="onEnterPress"
            v-model="searchedProduct"
          />

          <button @click="navigate()" class="search-button">
            <img :src="`/img/search-button.svg`" />
          </button>
        </div>
        <a>Связаться с нами</a>
      </div>
      <div
        v-if="cmptd_user == null || cmptd_user == undefined"
        @click="navigate('Login')"
        class="to-account"
      >
      <img :src="`/img/to-account.svg`" />
      <span>Войти</span>
      </div>
      <div v-else @click="navigate('ManagersPage')" class="to-account">
        <img :src="`/img/to-account.svg`" />
        <span>{{ user.userInfo.full_name }}</span>
      </div>
      <router-link :to="{ name: 'ShoppingCart' }">
        <img src="/img/shopping-cart.svg" alt="shopping_cart_image" />
        <span class="product-amount-counter">{{ cmptd_counter }}</span>
      </router-link>
    </div>
  </div>
</template>
<script lang="ts">
import { useCurrentUserStore } from "@/stores/currentUser";
import { useShoppingCartStore } from "@/stores/shoppingCart";
import type { SupabaseClient } from "@supabase/supabase-js";
import { defineComponent, inject } from "vue";
import { RouterLink } from "vue-router";

export default defineComponent({
  setup() {
    let supabase: SupabaseClient | undefined = inject("supabase");

    return { supabase };
  },
  computed: {
    cmptd_counter(): number {
      return this.shoppingCart.counter;
    },
    cmptd_user(): string {
      return this.user.userInfo.full_name;
    },
  },
  data() {
    return {
      shoppingCart: useShoppingCartStore(),
      user: useCurrentUserStore(),
      searchedProduct: ""
    };
  },
  methods: {
    onEnterPress(event: KeyboardEvent) {
      if (event.key == "Enter") {
        this.navigate();
      }
    },
    navigate(where?: string): void {
      if (where) {
        this.$router.push({ name: where });
        return;
      }
      if (this.searchedProduct.length > 0) {
        this.$router.push({
          name: "Product",
          params: { product_id: this.searchedProduct },
        });
      } else {
        alert("Введите артикул товара в поисковую строку");
      }
    },
  },
  async mounted() {
    if (this.supabase == undefined) {
      return;
    }
    await this.supabase.auth.getUser().then((response) => {
      if (response.data.user != null) {
        this.user.setNewUser(response.data.user);
      }
    });
  },
});
</script>
<style scoped>
.to-account {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 25px;
}
.to-account > img {
  width: 50px;
  height: 50px;
}
button {
  color: white;
  user-select: none;
  border: none;
  background: none;
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 25px;
  display: flex;
  align-items: center;
  text-align: center;
  flex: none;
  order: 0;
  flex-grow: 0;
}
.header {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.button-space {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.button-space > a {
  margin: 0 20px;
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 25px;

  color: #ffffff;
}
.line {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 73px;
  background: #2e75b6;
}
.line > * {
  margin: 0 5px;
}
.logo {
  margin-right: -15%;
  margin-left: auto;
  z-index: 2;
  width: 180px;
  height: 180px;
  left: 253px;
  top: 0px;
}
.search-bar {
  /* z-index: 1000; */
  background: #ffffff;
  border-radius: 10px;
  width: 544px;
  height: 37px;
  padding: 0 10px;
  border: none;
}
.search-bar:focus {
  outline: none;
}
.search-button {
  position: absolute;
  width: 41.29px;
  height: 37px;
  border: 1px solid #d9d9d9;
  border-radius: 10px;
}
.search-button > a {
  display: flex;
  align-items: center;
  justify-content: center;
}
.search-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: right;
}
.product-amount-counter {
  font-family: Arial, Helvetica, sans-serif;
  font-style: normal;
  font-weight: 800;
  font-size: 14px;
  line-height: 19px;

  color: #ffffff;
  position: absolute;
}
</style>
