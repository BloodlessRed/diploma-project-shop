<template>
  <div class="product-creator">
    <h2>Создание продукта</h2>
    <!-- Input elements for the new product fields -->
    <div class="product-fields">
      <div class="field">
        <label for="vendor-code">Артикул:</label>
        <input id="vendor-code" type="text" v-model="vendor_code" />
      </div>

      <div class="field">
        <label for="description">Описание:</label>
        <input id="description" type="text" v-model="description" />
      </div>

      <div class="field">
        <label for="price">Цена:</label>
        <input id="price" type="number" v-model.number="price" />
      </div>

      <div class="field">
        <label for="manufacturer">Производитель:</label>
        <input
          id="manufacturer"
          type="text"
          list="manufacturers"
          v-model="manufacturer"
          @keydown="keydownManufacturer"
          @change="inputManufacturer"
        />
        <datalist id="manufacturers">
          <option
            v-for="(man, index) in manufacturers"
            :key="index"
            :value="man.manufacturer"
          ></option>
        </datalist>
      </div>

      <div class="field">
        <label for="category">Категория:</label>
        <!-- datalist element for the category -->
        <input
          id="category"
          type="text"
          list="categories"
          v-model="category"
          @keydown="keydownCategory"
          @change="inputCategory"
        />
        <datalist id="categories">
          <option
            v-for="(cat, index) in categories"
            :key="index"
            :value="cat.full_description"
          ></option>
        </datalist>
      </div>

      <div class="field">
        <label for="img">Изображение:</label>
        <input id="img" type="text" v-model="img" />
      </div>
    </div>
    <!-- Button for submitting the new product -->
    <button @click="submitProduct">Создать продукт</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from "vue";
import type { SupabaseClient } from "@supabase/supabase-js";

export default defineComponent({
  name: "ProductCreator",
  // Receive the supabase prop from the parent component
  setup() {
    let supabase: SupabaseClient | undefined = inject("supabase");
    return { supabase };
  },
  data() {
    return {
      // Data properties for the new product fields
      description: "",
      price: 0,
      manufacturer: "",
      img: "",
      category: "",
      vendor_code: "",
      manufacturers: [] as { manufacturer: string }[],
      original_manufacturer: "",
      // Data property for storing the categories
      categories: [] as {
        id?:number,
        full_description?: string;
      }[],
      // Data property for storing the original value of the category before editing
      original_category: "",
      // Data property for storing a flag that indicates if the enter key is pressed
      enter_pressed: false,
    };
  },
  methods: {
    async keydownManufacturer(e: Event) {
      // Get the keyCode of the event
      let code = (e as KeyboardEvent).code;
      // Check if the keyCode is 13 (enter key)
      if (code === "Enter") {
        // Set the enter_pressed property to true
        this.enter_pressed = true;
      }
    },
    async inputManufacturer(e: Event) {
      // Get the value of the input element
      let value = (e.target as HTMLInputElement).value;
      // Check if the enter_pressed property is true
      if (this.enter_pressed) {
        // Check if the original_manufacturer property is not empty
        if (this.original_manufacturer) {
          // Find the index of the original manufacturer in the manufacturers array
          let index = this.manufacturers.findIndex(
            (man) => man.manufacturer === this.original_manufacturer
          );
          // Check if the index is valid
          if (index >= 0) {
            // Check if the value is not empty
            if (value) {
              // Update the manufacturer in the manufacturers array with the new value
              console.log(
                `The manufacturer ${this.original_manufacturer} is being edited, updating it to ${value}`
              );
              this.manufacturers[index].manufacturer = value;
              // Update the original_manufacturer to the new value
              this.original_manufacturer = value;
            } else {
              // Delete the manufacturer from the manufacturers array
              console.log(
                `The manufacturer ${this.original_manufacturer} is being deleted`
              );
              this.manufacturers.splice(index, 1);
              // Reset the original_manufacturer to an empty string
              this.original_manufacturer = "";
            }
          }
        }
        // Check if the value matches any of the existing manufacturers
        let match = this.manufacturers.find((man) => man.manufacturer === value);
        if (!match && value) {
          // The value is a new manufacturer and not empty, add it to the manufacturers array
          console.log(
            `The manufacturer ${value} is new, adding it to the array`
          );
          this.manufacturers.push({ manufacturer: value });
          // Update the original_manufacturer to the new value
          this.original_manufacturer = value;
        }
        // Reset the enter_pressed property to false
        this.enter_pressed = false;
      } else {
        // Set the original_manufacturer property to the value
        this.original_manufacturer = value;
      }
    },

    // Method for handling the keydown event of the input element
    async keydownCategory(e: Event) {
      // Get the keyCode of the event
      let code = (e as KeyboardEvent).code;
      // Check if the keyCode is 13 (enter key)
      if (code === "Enter") {
        // Set the enter_pressed property to true
        this.enter_pressed = true;
      }
    },
    // Method for handling the input event of the input element
    async inputCategory(e: Event) {
      // Get the value of the input element
      let value = (e.target as HTMLInputElement).value;
      // Check if the enter_pressed property is true
      if (this.enter_pressed) {
        // Check if the original_category property is not empty
        if (this.original_category) {
          // Find the index of the original category in the categories array
          let index = this.categories.findIndex(
            (cat) => cat.full_description === this.original_category
          );
          // Check if the index is valid
          if (index >= 0) {
            // Check if the value is not empty
            if (value) {
              // Update the category in the categories array with the new value
              console.log(
                `The category ${this.original_category} is being edited, updating it to ${value}`
              );
              this.categories[index].full_description = value;
              // Update the original_category to the new value
              this.original_category = value;
            } else {
              // Delete the category from the categories array
              console.log(
                `The category ${this.original_category} is being deleted`
              );
              this.categories.splice(index, 1);
              // Reset the original_category to an empty string
              this.original_category = "";
            }
          }
        }
        // Check if the value matches any of the existing categories
        let match = this.categories.find(
          (cat) => cat.full_description === value
        );
        if (!match && value) {
          // The value is a new category and not empty, add it to the categories array
          console.log(`The category ${value} is new, adding it to the array`);
          this.categories.push({ full_description: value });
          // Update the original_category to the new value
          this.original_category = value;
        }
        // Reset the enter_pressed property to false
        this.enter_pressed = false;
      } else {
        // Set the original_category property to the value
        this.original_category = value;
      }
    },
    // Method for submitting the new product
    async submitProduct() {
      if (this.supabase == undefined) {
        return;
      }
      // Write your logic to add the new product to the database using supabase
      // You can use this.description, this.price, this.manufacturer, this.img, this.category, and this.vendor_code as the values
      // You can use console.log or alert to show the result of the operation
      alert(`Создание продукта ${this.vendor_code}`);
    },
  },
  async mounted() {
    if (this.supabase == undefined) {
      return;
    }
    // Fetch the categories from the database and assign them to the categories data property
    let categories = await this.supabase
      .from("Categories")
      .select("id, full_description")
      .then((result) => {
        if (result.data == null) {
          return [];
        }
        return result.data;
      });
    this.categories = categories;
    let manufacturers = await this.supabase
      .from("Manufacturers")
      .select("id, manufacturer")
      .then((result) => {
        console.log("MANUFACTURERS ",result)
        if (result.data == null) {
          return [];
        }
        return result.data;
      });
    this.manufacturers = manufacturers;
  },
});
</script>

<style scoped>
/* Product creator */
.product-creator {
  border: 1px solid black;
  padding: 10px;
}

.product-creator h2 {
  color: #0a3f6c;

  margin-bottom: 10px;
}

/* Product fields */
.product-fields {
  display: grid; /* use grid layout */
  grid-template-columns: repeat(2, 1fr); /* create two equal columns */
  gap: 10px; /* add some gap between the inputs */
}
/* Field */
.field {
  display: flex; /* use flexbox layout */
  align-items: center; /* align items vertically */
  justify-content: space-between; /* align items horizontally */
}
.product-fields label {
  color: #0a3f6c;
  font-weight: bold;
}

.product-fields input,
.product-fields select {
  width: 200px;
}

/* Submit button */
button {
  color: #ffffff;
  background-color: #0a3f6c;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}
</style>
