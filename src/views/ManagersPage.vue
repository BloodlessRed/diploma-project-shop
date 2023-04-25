<template>
    <div id="app">
      <div class="block1">
        <h1>Personal Information</h1>
        <p>Name: {{ name }}</p>
        <p>Email: {{ email }}</p>
        <p>Phone: {{ phone }}</p>
        <p>Company: {{ company }}</p>
      </div>
      <div class="block2">
        <h1>Current Orders</h1>
        <ul>
          <li v-for="order in orders" :key="order.id">
            <p>Order ID: {{ order.id }}</p>
            <p>Client Name: {{ order.clientName }}</p>
            <p>Product: {{ order.product }}</p>
            <p>Quantity: {{ order.quantity }}</p>
            <p>Price: {{ order.price }}</p>
            <button v-if="!order.registered" @click="createAccount(order.clientName)">Create Account</button>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script lang="ts">
import { defineComponent } from 'vue';

  export default defineComponent({
    name: "ManagersPage",
    data() {
      return {
        name: "John Smith",
        email: "john.smith@newtonm.com",
        phone: "+1234567890",
        company: "Newton M",
        orders: [
          {
            id: 1,
            clientName: "Alice Brown",
            product: "Laptop",
            quantity: 2,
            price: 1000,
            registered: true,
          },
          {
            id: 2,
            clientName: "Bob Green",
            product: "Mouse",
            quantity: 5,
            price: 50,
            registered: false,
          },
          {
            id: 3,
            clientName: "Charlie White",
            product: "Keyboard",
            quantity: 3,
            price: 100,
            registered: false,
          },
        ],
      };
    },
    methods: {
      createAccount(clientName:string) {
        // write your logic to create a new account for the client
        alert(`Creating account for ${clientName}`);
      },
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
  