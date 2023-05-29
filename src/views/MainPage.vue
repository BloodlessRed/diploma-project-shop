<template>
  <div class="main-wrapper">
    <div class="introduction">
      <p>{{ introduction }}</p>
    </div>
    <div class="category-block">
      <div class="category">
        <router-link
          v-for="manufacturer in manufacturers"
          :to="{
            name: 'Manufacturer',
            params: { manufacturer: manufacturer },
          }"
          active-class="active-link"
        >
          <span>
            {{ manufacturer }}
          </span>
          <img class="manufacturer-logo" :src="`./img/${manufacturer}.svg`" />
        </router-link>
      </div>
    </div>
    <router-view />
  </div>
</template>
<script lang="ts" scoped>
import type { SupabaseClient } from "@supabase/supabase-js";
import { defineComponent, inject } from "vue";
import { RouterLink } from "vue-router";

export default defineComponent({
  setup() {
    const supabase: SupabaseClient | undefined = inject("supabase");
    return {
      supabase,
    };
  },
  data() {
    return {
      introduction:
        "Добро пожаловать в магазин компании. Здесь мы продаем инструменты и запчасти от различных поставщиков для сборочного процесса",
      manufacturers: [] as any[],
    };
  },
  async mounted() {
    if (this.supabase == undefined) {
      return;
    }
    await this.supabase
      .from("Manufacturers")
      .select("manufacturer")
      .then((value) => {
        value.data != null
          ? (this.manufacturers = value.data.map((val) => val.manufacturer))
          : null;
        console.log(this.manufacturers);
      });
  },
});
</script>
<style scoped>
img {
  max-width: fit-content;
}

.introduction {
  display: flex;
  width: 100%;
}

.introduction:first-child {
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  line-height: 28px;
}

.slider {
  flex-grow: 1;
}

.category-block {
  display: flex;
  justify-content: space-evenly;
}

.category {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  max-height: 10vh;
}

.category p {
  max-width: calc(10% + 5px);
}
.category a {
  text-decoration: none;
  color: #38363a;
  font-weight: bolder;
  font: 1.8rem "Noto Sans", sans-serif;
  outline: solid 0.1rem grey;
  border-radius: 0.5rem;
  height: 50%;
  width: fit-content;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-right: 15px;
}
/* a {
  border: solid 0.1rem #c0c0c0;
  border-radius: 0.5rem;
  transition: border 0.3s, box-shadow 0.3s; 
} */

.active-link {
  border: solid 0.2rem #c0c0c0; /* change this line */
  box-shadow: 0 0 15px #c0c0c0; /* change this line */
}


.manufacturer-logo {
  width: auto;
  height: 90%;
  margin: 0 10px;
}

span {
  margin: 0 10px;
}
</style>
