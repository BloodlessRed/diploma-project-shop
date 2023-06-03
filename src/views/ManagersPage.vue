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
                <th>Название организации</th>
                <th>Продукт</th>
                <th>Выручка</th>
                <th>Документ</th>
                <th>Действие</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in orders" :key="order.id">
                <td>{{ order.id }}</td>
                <td>{{ order.clientNote.orgName }}</td>
                <td>
                  <span v-for="product in order.products"
                    >[{{ product.vendor_code }} - {{ product.amount }}] <br
                  /></span>
                </td>
                <td>{{ order.revenue }}</td>
                <td><a :href="order.document">Коммерческое предложение</a></td>
                <td>
                  <!-- Removed the v-if condition as it was always true -->
                  <button v-if="!order.client" @click="createAccount(order.clientNote)">
                    Создать аккаунт
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Moved the buttons for editing and adding products to the same place -->
        <div class="editor-buttons">
          <!-- Added a label for clarity -->
          <label for="editor-buttons">Действия с продуктом:</label>

          <!-- Added a button for adding a new product -->
          <button @click="toggleCreator('product')">Добавить продукт</button>

          <!-- Changed the button text to "Search and Edit Product" -->
          <button @click="toggleEditor">Найти и отредактировать продукт</button>
        </div>
        <div class="editor-wrapper">
          <div class="product-editor" v-if="showEditor">
            <h2>Редактор продуктов</h2>
            <!-- New input for vendor code -->
            <div class="vendor-code-input">
              <label for="vendor-code">Артикул:</label>
              <input
                id="vendor-code"
                type="text"
                v-model.lazy="vendorCode"
                @change="searchProduct"
              />
            </div>
            <!-- Conditional table for displaying and editing the found products -->
            <table v-if="foundProducts.length > 0">
              <thead>
                <tr>
                  <th>Артикул</th>
                  <th>Название</th>
                  <th>Цена</th>
                  <th>Производитель</th>
                  <th>Категория</th>
                  <!-- Added a column for the update button -->
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                <!-- Changed the v-for loop to iterate over the foundProducts array -->
                <tr v-for="product in foundProducts" :key="product.id">
                  <!-- Using v-model to bind the data -->
                  <td>
                    <input type="text" v-model="product.vendor_code" disabled />
                  </td>
                  <td>
                    <input type="text" v-model.lazy="product.description" />
                  </td>
                  <td>
                    <input type="number" v-model.lazy="product.price" />
                  </td>
                  <!-- Added inputs for manufacturer and category -->
                  <td>
                    <input
                      type="text"
                      v-model="product.manufacturer"
                      disabled
                    />
                  </td>
                  <td>
                    <!-- Using a select element for the category -->
                    <input type="text" v-model="product.category" disabled />
                  </td>
                  <!-- Added a button for updating the selected product in each row -->
                  <td class="editor-actions">
                    <button @click="updateProduct(product)">
                      Обновить продукт
                    </button>
                    <button @click="deleteProduct(product)">
                      Удалить продукт
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  <product-creator
    :show="showProductCreator"
    @close-pop-up="toggleCreator"
  />
<account-creator :info="clientInfo" :show="showAccountCreator" @close-pop-up="toggleCreator" @update-orders="updateOrdersWithCompanyId"/>
</template>
<script lang="ts">
import { useCurrentUserStore } from "@/stores/currentUser";
import type { SupabaseClient } from "@supabase/supabase-js";
import ProductCreator from "./ProductCreator.vue";
import AccountCreator from "./AccountCreator.vue";
import { defineComponent, inject } from "vue";
type FullProduct = {
  id: any;
  description: string;
  price: number;
  manufacturer?: string;
  img?: string;
  category?: string;
  vendor_code: string;
};

export default defineComponent({
  name: "ManagersPage",
  setup() {
    const supabase: SupabaseClient | undefined = inject("supabase");
    return { supabase };
  },
  components: {
    ProductCreator,
    AccountCreator
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
          clientNote: {} as any,
          document: "Laptop",
          products: [] as any[],
          revenue: 1000,
          client:""
        },
      ],
      clientInfo:{},
      products: [] as any[],
      // New data property for controlling the visibility of the product editor
      showEditor: false,
      showProductCreator: false,
      showAccountCreator:false,
      // New data property for storing the input value of the vendor code
      vendorCode: "",
      // Modified data property for storing the found products
      foundProducts: [] as FullProduct[],
      // New data property for storing the categories
      categories: [] as {
        id?: number;
        full_description: string;
      }[],
    };
  },
  methods: {
    updateOrdersWithCompanyId(array:number[],id:number){
      let selectedOrders = this.orders.filter((elem)=>{
         return array.includes(elem.id)
      })
      console.log(selectedOrders)
      selectedOrders.forEach((elem)=>{
        elem.client = id.toString()
      })
    },
    // New method for toggling the product adder
    toggleCreator(eventType:string) {
      if(eventType == "product"){
        this.showProductCreator = !this.showProductCreator;
      } else if (eventType == "account"){
        this.showAccountCreator = !this.showAccountCreator
      }
      
    },
    // Modified method for toggling the product editor
    toggleEditor() {
      this.showEditor = !this.showEditor;
    },
    // Modified method for searching a product by vendor code
    async searchProduct() {
      if (this.supabase == undefined) {
        return;
      }
      // Modified the query to include an inner join with the Category table and select all the columns from the Products table
      let foundProducts = await this.supabase
        .from("full_products")
        .select("id,description,price,manufacturer,img,category,vendor_code")
        .ilike("vendor_code", "%" + this.vendorCode + "%")
        .then((result) => {
          console.log("FOUND PRODUCTS ", result);
          if (result.data == null) {
            return [];
          }
          return result.data;
        });
      // Assigning the whole array of the found products to the foundProducts data property
      this.foundProducts = foundProducts.map((element) => {
        return {
          id: element.id,
          description: element.description,
          price: element.price,
          manufacturer: element.manufacturer,
          img: element.img,
          category: element.category,
          vendor_code: element.vendor_code,
        };
      });
      alert(`Searching product by ${this.vendorCode}`);
    },
    // New method for updating the selected product
    async updateProduct(product: FullProduct) {
      if (this.supabase == undefined) {
        return;
      }
      this.supabase
        .from("Products")
        .update({ description: product.description, price: product.price })
        .eq("vendor_code", product.vendor_code)
        .then((res) => console.log(res));
      // write your logic to update the selected product in the database using supabase
      // you can use product as the updated value
      // you can use product.vendor_code as the primary key
      alert(`Updating product ${product.vendor_code}`);
    },
    // New method for adding a product
    async addProduct() {
      if (this.supabase == undefined) {
        return;
      }
      // write your logic to add a new product in the database
      // you can use prompt() or modal to get the values from the user
      alert(`Adding a new product`);
    },
    async deleteProduct(product: FullProduct) {
      this.supabase
        ?.from("Products")
        .delete()
        .eq("id", product.id)
        .then((elem) => {
          if (!elem.error) {
            let index = this.foundProducts.findIndex((elem) => {
              return elem.id == product.id;
            });
            console.log(index);
            this.foundProducts.splice(index, 1);
            console.log("logging array length ", this.foundProducts.length);
          }
        });
    },
    createAccount(clientNote: any) {

      // write your logic to create a new account for the client
      this.showAccountCreator = !this.showAccountCreator
      this.clientInfo = clientNote
    },
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

    let temp_order_ids = [];
    for (let i = 0; i < data.length; i++) {
      let element = data[i];
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
      let productsToBeDisplayed = products?.get(String(element.order_id));
      productsToBeDisplayed =
        productsToBeDisplayed == undefined
          ? new Array()
          : productsToBeDisplayed;
      this.orders.push({
        id: element.order_id,
        clientNote: clientsNote,
        products: productsToBeDisplayed,
        document: link,
        revenue: element.overall_price,
        client: element.company_id
      });
    }
    loader.hide();
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
  grid-template-areas: /* changed grid template */
    "personal-info current-orders"
    "editor-buttons editor-buttons" /* added a new row for the editor buttons */
    "editor-wrapper editor-wrapper";
  gap: 20px;
  padding: 20px;
}
/* Personal info */
.personal-info {
  border: 1px solid black;
  padding: 10px;
  grid-area: personal-info; /* added grid-area */
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
  grid-area: current-orders; /* added grid-area */
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
/* Editor buttons */
.editor-actions > button {
  width: 150px;
  margin: 0 3px;
}
.editor-buttons {
  display: flex;
  align-items: center;
  gap: 10px; /* for spacing */
  grid-area: editor-buttons; /* added grid-area */
}

.editor-buttons button {
  margin: 0;
  width: max-content;
}
.editor-buttons label {
  color: #0a3f6c; /* for consistency */
}

/* Editor wrapper */
.editor-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  grid-area: editor-wrapper; /* added grid-area */
}

/* Product editor */
.product-editor {
  border: 1px solid black;
  padding: 10px;
  margin-top: 10px; /* added margin */
}

.product-editor h2 {
  color: #0a3f6c;

  margin-bottom: 10px;
}

.product-editor table {
  width: 100%;
  border-collapse: collapse; /* for minimalistic design */
}

.product-editor th,
.product-editor td {
  border-bottom: 1px solid black; /* for minimalistic design */
  padding: 5px;
  text-align: center;
  vertical-align: top;
}

.product-editor th {
  font-weight: bold;
}

.product-editor td {
  color: #2e75b6;
  font-weight: normal;
}

.product-editor button {
  color: #ffffff;
  background-color: #0a3f6c;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

/* Vendor code input */
.vendor-code-input {
  display: flex;
  align-items: center;
  gap: 10px;
}

.vendor-code-input label {
  color: #0a3f6c;
  font-weight: bold;
}

.vendor-code-input input {
  width: 200px;
}

/* Modified button for toggling the product editor */
button {
  color: #ffffff;
  background-color: #0a3f6c;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  width: 200px; /* added width */
  margin-bottom: 10px; /* added margin */
}
</style>
