<template>
  <div class="main-wrapper">
    <div class="container">
      <div class="header">
        <h1>{{ company }}</h1>
        <button class="sign-out" @click="signOut()">Выйти</button>
      </div>
      <div class="content" ref="loaderAnchor">
        <div class="personal-info">
          <h2>Личная информация</h2>
          <p><strong>Имя:</strong> {{ name }}</p>
          <p><strong>Email:</strong> {{ email }}</p>
          <p><strong>Телефон:</strong> {{ phone }}</p>
        </div>
        <div class="current-orders">
          <h2>Текущие заказы</h2>
          <table>
            <thead>
              <tr>
                <th>Номер заказа</th>
                <!-- Removed the organization name column as it is redundant for the client -->
                <th>Продукты</th>
                <!-- Renamed the revenue column to "Общая стоимость" -->
                <th>Общая стоимость</th>
                <th>Документ</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in orders" :key="order.id">
                <td>{{ order.id }}</td>
                <!-- Removed the client note as it is not relevant for the client -->
                <td>
                  <span v-for="product in order.products"
                    >[{{ product.vendor_code }} - {{ product.amount }}] <br
                  /></span>
                </td>
                <!-- Renamed the revenue column to "Общая стоимость" -->
                <td>{{ order.revenue }}</td>
                <!-- Changed the document link to a simple anchor tag that opens in a new tab -->
                <!-- Removed the modal component and its logic -->
                <td>
                  <a :href="order.document" target="_blank"
                    >Коммерческое предложение</a
                  >
                </td>
                <td>{{ order.status }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Removed the editor buttons and wrapper as they are not needed for the client -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useCurrentUserStore } from "@/stores/currentUser";
import type { SupabaseClient } from "@supabase/supabase-js";
import { defineComponent, inject } from "vue";

export default defineComponent({
  name: "ClientsPage",
  setup() {
    const supabase: SupabaseClient | undefined = inject("supabase");
    return { supabase };
  },
  data() {
    return {
      userStore: useCurrentUserStore(),
      name: "Jane Doe",
      email: "jane.doe@newtonm.com",
      phone: "+1234567890",
      company: "Newton M",
      orders: [
        {
          id: 1,
          document: "Laptop",
          products: [] as any[],
          status: "новый",
          revenue: 1000,
        },
      ],
      products: [] as any[],
    };
  },
  methods: {
    signOut() {
      this.supabase?.auth.signOut();
      this.userStore.$reset();
      this.$router.push({ name: "Login" });
    },
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
    let email = this.userStore.supabaseUser.email;
    console.log("email ", email);
    let data: any = await this.supabase
      .from("Orders")
      .select(
        "*, Companies!inner(full_name, Clients!inner(full_name, email, phone))"
      )
      .eq("Companies.login", email)
      .then((val) => {
        console.log(val);
        return val.data;
      });
    if (data == null) {
      return;
    }

    this.name = data[0].Companies.Clients.full_name;
    this.email = data[0].Companies.Clients.email;
    this.phone = data[0].Companies.Clients.phone;
    this.orders = [];

    let temp_order_ids = [];
    for (let i = 0; i < data.length; i++) {
      let element = data[i];
      console.log(element);
      temp_order_ids.push(element.order_id);
    }
    let products = await this.supabase
      .from("products_in_order")
      .select("order_id,vendor_code, amount")
      .in("order_id", temp_order_ids)
      .order("order_id")
      .then((value) => {
        if (value.data != null) {
          let productMap = new Map<
            string,
            Array<{ vendor_code: any; amount: any }>
          >();
          value.data.forEach((item) => {
            let tempProduct = {
              vendor_code: item.vendor_code,
              amount: item.amount,
            };
            if (productMap.has(String(item.order_id))) {
              productMap.get(String(item.order_id))?.push(tempProduct);
            } else {
              productMap.set(
                String(item.order_id),
                new Array<{ vendor_code: any; amount: any }>(tempProduct)
              );
            }
          });
          return productMap;
        }
      });
    console.log(products);
    for (let i = 0; i < data.length; i++) {
      let element = data[i];
      if (element.Companies == null) {
        continue;
      }

      // Removed the client note parsing as it is not needed for the client

      let base64str: string = element.document;
      let binary = window.atob(base64str.split(",")[1]); // remove the data URL prefix and convert to binary
      let array = [];
      for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i)); // convert each character to its ASCII code
      }
      let blob = new Blob([new Uint8Array(array)], { type: "application/pdf" });
      let link = URL.createObjectURL(blob);
      let productsToBeDisplayed = products?.get(String(element.order_id));
      productsToBeDisplayed =
        productsToBeDisplayed == undefined
          ? new Array()
          : productsToBeDisplayed;
      this.orders.push({
        id: element.order_id,
        products: productsToBeDisplayed,
        document: link,
        status: element.status,
        revenue: element.overall_price,
      });
    }
    loader.hide();
  },
});
</script>

<style scoped>
/* Copied styles from ManagersPage */

/* Corporate colors */
.white {
  color: #ffffff;
}

.blue {
  color: #2e75b6;
}

.light-blue {
  color: black;
}

.dark-blue {
  color: #0a3f6c;
}

/* Container */
.container {
  margin: 0 auto;
  border: 1px solid #2e75b6;
  background-color: #ffffff;
  /* font-size: 1.34em; */
}

/* Header */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  background-color: #2e75b6;
}

.header h1 {
  color: #ffffff;
}

.sign-out {
  color: #ffffff;
  background-color: #0a3f6c;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
}

/* Content */
.content {
  position: relative;
  display: grid;

  /* Changed grid template to remove editor buttons and wrapper */
  grid-template-areas: "personal-info current-orders";
  gap: 20px;
  padding: 20px;
}
/* Personal info */
.personal-info {
  border: 1px solid black;
  padding: 10px;

  /* Added grid-area */
  grid-area: personal-info;
}

.personal-info h2 {
  color: #0a3f6c;

  margin-bottom: 10px;
}

.personal-info p {
  color: #2e75b6;

  margin-bottom: 5px;
}
/* Current orders */
.current-orders {
  border: 1px solid black;

  padding: 10px;

  overflow-x: auto; /* for responsiveness */

  /* Added grid-area */
  grid-area: current-orders;
}

.current-orders h2 {
  margin-bottom: 10px;
}

.current-orders table {
  width: 100%;

  border-collapse: collapse; /* for minimalistic design */
}

.current-orders th,
.current-orders td {
  border-bottom: 1px solid black; /* for minimalistic design */

  padding: 5px 15px;

  text-align: left;

  vertical-align: top;
  text-align: center;
}

.current-orders th {
  color: #0a3f6c;

  font-weight: bold;
}

.current-orders td {
  color: #2e75b6;

  font-weight: normal;
}

.current-orders a {
  color: #0a3f6c;

  text-decoration: none;
}

.current-orders button {
  color: #ffffff;

  background-color: #0a3f6c;

  border: none;

  padding: 5px 10px;

  cursor: pointer;
}
</style>
