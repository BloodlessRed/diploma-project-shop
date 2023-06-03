<template>
  <div class="footer-wrapper">
    <div class="footer-content">
      <div class="logo">
        <img :src="`/img/logo.svg`" />
        <div>Newtonm.com</div>
      </div>
      <!-- removed the site-sections div -->
      <div class="site-section">
        <!-- moved this div to the same level as the logo -->
        <p>Поставщики</p>
        <router-link
          :to="{ name: 'Manufacturer', params: { manufacturer: supplier } }"
          v-for="supplier in suppliers"
        >
          {{ supplier[0].toUpperCase() + supplier.slice(1,supplier.length) }}
        </router-link>
      </div>
      <div class="site-section">
        <!-- moved this div to the same level as the logo -->
        <a>Связаться с нами</a>
      </div>
    </div>
    <div class="footer-info">
      <div class="copy">©2010-2022 ”Ньютон М”</div>
      <div class="address">
        <p>Тольятти, ул. Дзержинского 12, оф. 10</p>
        <p>ИНН 6321459534, КПП 632101001</p>
        <p>Телефон: +7 (499) 455 1670</p>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import type { SupabaseClient } from "@supabase/supabase-js";
import { defineComponent, inject } from "vue";

export default defineComponent({
  setup() {
    let supabase: SupabaseClient | undefined = inject("supabase");
    return { supabase };
  },
  data() {
    return {
      imgSrc: "logo.svg",
      suppliers: ["Поставщик 1", "Поставщик 2"],
      // categories: ["Категория 1", "Категория 2"], // removed this line
      // serviceCenters: ["Сервисный центр 1", "Сервисный центр 2"], // removed this line
    };
  },
  methods: {
    test() {
      console.log("Hello world!");
    },
  },
  async mounted() {
      if(this.supabase == undefined){
        console.log("supabase is undefined")
        return
      }
      this.suppliers = await this.supabase
        .from("Manufacturers")
        .select("manufacturer")
        .then((resp) => {
          console.log(resp)
          if (resp.data != undefined || resp.data != null) {
            return resp.data.map((elem)=>elem.manufacturer) 
          } else{
            return []
          }
        }) as string[];
    },

});
</script>
<style scoped>
.footer-wrapper {
  display: grid;
  grid-template-rows: auto auto;
  background: #161616;
}

.footer-content {
  display: grid;
  grid-template-columns: auto auto auto; /* changed this from two columns to three columns to accommodate the site sections */
  justify-content: space-around;
  padding: 0 12%;
  align-items: flex-start; /* added this line to align the footer content with the footer info */
}

.logo {
  display: flex;
  height: 100%;
  align-items: center;
  max-width: fit-content;
}
.logo > div:last-of-type {
  color: white;
  font-weight: bold;
  font-size: 24px;
  margin-left: 15px;
}
/* removed the site-sections style */

.site-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  margin-bottom: 10px;
}

.site-section > p,
a {
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 25px;
  text-align: center;
  color: #ffffff;
}
.footer-info {
  display: grid;
  grid-template-columns: auto auto;
  justify-content: space-around;
  align-items: flex-start;
}
.copy {
  display: flex;
  align-items: center;
  height: 100%;
  color: #fff;
}
.address {
  color: white;
}
</style>
