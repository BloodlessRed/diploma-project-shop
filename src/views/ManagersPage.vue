<template>
  <div id="app">
    <div class="block1">
      <h1>Personal Information</h1>
      <p>Name: {{ name }}</p>
      <p>Email: {{ email }}</p>
      <p>Phone: {{ phone }}</p>
      <button @click="signOut()">Sign out</button>
    </div>
    <div class="block2">
      <h1>Current Orders</h1>
      <ul>
        <li v-for="order in orders" :key="order.id">
          <p>Order ID: {{ order.id }}</p>
          <p>Client Name: {{ order.clientCompany }}</p>
          <p>Product: {{ order.products }}</p>
          <p>Revenue: {{ order.revenue }}</p>
          <a :href="order.document">Commercial offer</a>
          <button v-if="true" @click="createAccount(order.clientCompany)">
            Create Account
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import type { SupabaseClient } from "@supabase/supabase-js";
import { defineComponent, inject } from "vue";

export default defineComponent({
  name: "ManagersPage",
  setup() {
    const supabase: SupabaseClient | undefined = inject("supabase");
    return { supabase };
  },
  data() {
    return {
      name: "John Smith",
      email: "john.smith@newtonm.com",
      phone: "+1234567890",
      company: "Newton M",
      orders: [
        {
          id: 1,
          clientCompany: "Alice Brown",
          document: "Laptop",
          products: "",
          revenue: 1000,
        },
      ],
    };
  },
  methods: {
    createAccount(clientName: string) {
      // write your logic to create a new account for the client
      alert(`Creating account for ${clientName}`);
    },
    signOut(){
      this.supabase?.auth.signOut()
    }
  },
  async mounted() {
    if (this.supabase == undefined) {
      return;
    }
    let email = this.$route.params.manager;
    console.log("email ", email);
    let data = await this.supabase
      .from("Orders")
      .select("*, Managers!inner(full_name, login)")
      .eq("Managers.login", email)
      .then((val) => {
        console.log(val);
        return val.data;
      });
    if (data == null) {
      return;
    }
    this.orders = [];
    for (let i = 0; i < data.length; i++) {
      let element = data[i];
      if (element.Managers == null) {
        break;
      }
      this.name = element.Managers.full_name;
      this.email = element.Managers.login;
      this.phone = element.Managers.phone_num;
      let clientsNote = JSON.parse(element.note);
      let products = await this.supabase
        .from("products_in_order")
        .select("vendor_code, amount")
        .eq("order_id", element.order_id)
        .then((value) => {
          return value.data;
        });
      if (products == null) {
        products = [];
      }
      let base64str: string = element.document;
      console.log(base64str.split(",")[1]);
      let binary = window.atob(base64str.split(",")[1]); // remove the data URL prefix and convert to binary
      let array = [];
      for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i)); // convert each character to its ASCII code
      }
      let blob = new Blob([new Uint8Array(array)], { type: "application/pdf" });
      // let docBlob = new Blob([base64str.split(",")[1]], {
      //   type: "application/pdf",
      // });
      let link = URL.createObjectURL(blob);
      this.orders.push({
        id: element.order_id,
        clientCompany: clientsNote.orgType + " " + clientsNote.orgName,
        products: products.toString(),
        document: link,
        revenue: element.overall_price,
      });
    }
  },
});
</script>

<style>
.block1 {
  border: 1px solid black;
  padding: 10px;
}

.block2 {
  border: 1px solid black;
  padding: 10px;
}
</style>
