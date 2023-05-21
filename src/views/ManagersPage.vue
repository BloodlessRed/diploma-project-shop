<template>
  <div class="main-wrapper">
    <div class="container">
      <div class="header">
        <h1>{{ company }}</h1>
        <button class="sign-out" @click="signOut()">Sign out</button>
      </div>
      <div class="content">
        <div class="personal-info">
          <h2>Personal Information</h2>
          <p><strong>Name:</strong> {{ name }}</p>
          <p><strong>Email:</strong> {{ email }}</p>
          <p><strong>Phone:</strong> {{ phone }}</p>
        </div>
        <div class="current-orders">
          <h2>Current Orders</h2>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Client Name</th>
                <th>Product</th>
                <th>Revenue</th>
                <th>Document</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in orders" :key="order.id">
                <td>{{ order.id }}</td>
                <td>{{ order.clientCompany }}</td>
                <td>
                  <span v-for="product in order.products"
                    >[{{ product.vendor_code }} - {{ product.amount }}] <br
                  /></span>
                </td>
                <td>{{ order.revenue }}</td>
                <td><a :href="order.document">Commercial offer</a></td>
                <td>
                  <button
                    v-if="true"
                    @click="createAccount(order.clientCompany)"
                  >
                    Create Account
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useCurrentUserStore } from "@/stores/currentUser";
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
      userStore: useCurrentUserStore(),
      name: "John Smith",
      email: "john.smith@newtonm.com",
      phone: "+1234567890",
      company: "Newton M",
      orders: [
        {
          id: 1,
          clientCompany: "Alice Brown",
          document: "Laptop",
          products: [] as any[],
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
    signOut() {
      this.supabase?.auth.signOut();
      this.$router.push({ name: "Login" });
    },
  },
  async mounted() {
    if (this.supabase == undefined) {
      return;
    }
    let email = this.userStore.supabaseUser.email;
    console.log("email ", email);
    let data:any = await this.supabase
      .from("Orders")
      .select("*, Managers!inner(full_name, login, phone_num)")
      .eq("Managers.login", email)
      .then((val) => {
        console.log(val);
        return val.data;
      });
    if (data == null) {
      return;
    }

    this.name = data[0].Managers.full_name;
    this.email = data[0].Managers.login;
    this.phone = data[0].Managers.phone_num;
    this.orders = [];

    let temp_order_ids = []
    for(let i = 0; i < data.length; i++){
      let element = data[i];
      temp_order_ids.push(element.order_id)
    }
    let products = await this.supabase
        .from("products_in_order")
        .select("order_id,vendor_code, amount")
        .in("order_id", temp_order_ids)
        .order("order_id")
        .then((value) => {
          if(value.data != null){
            let productMap = new Map<string,Array<{vendor_code:any, amount:any}>>()
            value.data.forEach((item)=>{
              let tempProduct = {vendor_code:item.vendor_code, amount:item.amount}
              if(productMap.has(String(item.order_id))){
                productMap.get(String(item.order_id))?.push(tempProduct)
              }else{
                productMap.set(String(item.order_id), new Array<{vendor_code:any, amount:any}>(tempProduct))
              }
            });
            return productMap
          }
        });
      console.log(products)
    for (let i = 0; i < data.length; i++) {
      let element = data[i];
      if (element.Managers == null) {
        continue;
      }

      let clientsNote = JSON.parse(element.note);
      
      let base64str: string = element.document;
      let binary = window.atob(base64str.split(",")[1]); // remove the data URL prefix and convert to binary
      let array = [];
      for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i)); // convert each character to its ASCII code
      }
      let blob = new Blob([new Uint8Array(array)], { type: "application/pdf" });
      let link = URL.createObjectURL(blob);
      let productsToBeDisplayed = products?.get(String(element.order_id))
      productsToBeDisplayed = productsToBeDisplayed == undefined ? new Array() : productsToBeDisplayed
      this.orders.push({
        id: element.order_id,
        clientCompany: clientsNote.orgType + " " + clientsNote.orgName,
        products: productsToBeDisplayed,
        document: link,
        revenue: element.overall_price,
      });
    }
  },
});
</script>

<style scoped>
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
  width: 80%;
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
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
  padding: 20px;
}

/* Personal info */
.personal-info {
  border: 1px solid black;
  padding: 10px;
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
}

.current-orders h2 {
  color: #0a3f6c;

  margin-bottom: 10px;
}

.current-orders table {
  width: 100%;
  border-collapse: collapse; /* for minimalistic design */
}

.current-orders th,
.current-orders td {
  border-bottom: 1px solid black; /* for minimalistic design */
  padding: 5px;
  text-align: left;
  vertical-align: top;
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
