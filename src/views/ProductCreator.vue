<template>
  <teleport to="body">
    <div class="overlay" v-if="show"></div>
    <form class="product-creator" v-show="show" @submit="submitProduct">
      <span @click="$emit('closePopUp','product')" class="close-button">Закрыть</span>
      <h2>Создание продукта</h2>
      <!-- Input elements for the new product fields -->
      <div class="product-fields">
        <div class="field">
          <label for="vendor-code">Артикул:</label>
          <input id="vendor-code" type="text" v-model="vendor_code" required/>
        </div>

        <div class="field">
          <label for="description">Описание:</label>
          <input id="description" type="text" v-model="description" required/>
        </div>

        <div class="field">
          <label for="price">Цена:</label>
          <input id="price" type="number" v-model.number="price" required/>
        </div>

        <div class="field">
          <label for="manufacturer">Производитель:</label>
          <input
            id="manufacturer"
            type="text"
            list="manufacturers"
            v-model="manufacturer"
            required
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
            required
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
          <input id="img" type="text" v-model="img" disabled />
        </div>
      </div>
      <!-- Button for submitting the new product -->
      <input type="submit" placeholder="Создать продукт"/>
    </form>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, inject } from "vue";
import type { SupabaseClient } from "@supabase/supabase-js";

export default defineComponent({
  name: "ProductCreator",
  emits:['closePopUp'],
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
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
      manufacturers: [] as { id?: number; manufacturer?: string }[],
      original_manufacturer: "",
      // Data property for storing the categories
      categories: [] as {
        id?: number;
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
              this.supabase
                ?.from("Manufacturers")
                .update({ manufacturer: value })
                .eq("manufacturer", this.original_manufacturer)
                .then((resp) => {
                  alert(resp.status + " " + resp.statusText);
                });
              // Update the original_manufacturer to the new value
              this.original_manufacturer = value;
            } else {
              // Delete the manufacturer from the manufacturers array
              console.log(
                `The manufacturer ${this.original_manufacturer} is being deleted`
              );

              this.supabase
                ?.from("Manufacturers")
                .delete()
                .eq("manufacturer", this.manufacturers[index].manufacturer)
                .then((resp) => {
                  console.log("deleting manuf ", resp);
                  if (resp.status >= 200 && resp.status < 300) {
                    this.manufacturers.splice(index, 1);
                    alert(resp.statusText);
                  } else {
                    alert(resp.error?.details);
                  }
                });
              // Reset the original_manufacturer to an empty string
              this.original_manufacturer = "";
            }
          }
        }
        // Check if the value matches any of the existing manufacturers
        let match = this.manufacturers.find(
          (man) => man.manufacturer === value
        );
        if (!match && value) {
          // The value is a new manufacturer and not empty, add it to the manufacturers array
          console.log(
            `The manufacturer ${value} is new, adding it to the array`
          );
          await this.supabase
            ?.from("Manufacturers")
            .insert({ manufacturer: value })
            .select("id,manufacturer")
            .single()
            .then((res) => {
              if (res.data) {
                // Return res.data
                this.manufacturers.push(res.data);
              }
            });
          //this.manufacturers.push(newManufacturer == undefined ? {} : newManufacturer);

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
              this.supabase
                ?.from("Categories")
                .update({ full_description: value })
                .eq("full_description", this.original_category);
              // Update the original_category to the new value
              this.original_category = value;
            } else {
              // Delete the category from the categories array
              console.log(
                `The category ${this.original_category} is being deleted`
              );
          
              this.supabase
                ?.from("Categories")
                .delete()
                .eq("full_description", this.categories[index].full_description)
                .then((resp) => {
                  if (resp.status >= 200 && resp.status < 300) {
                    this.categories.splice(index, 1)
                    alert(resp.statusText);
                  } else {
                    alert(resp.error?.details);
                  }
                });
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
          await this.supabase
            ?.from("Categories")
            .insert({ category: value })
            .select("id,manufacturer")
            .single()
            .then((res) => {
              if (res.data) {
                // Return res.data
                this.categories.push(res.data);
              }
            });

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
    async submitProduct(e: Event) {
      e.preventDefault()
      if (this.supabase == undefined) {
        return;
      }
      console.log(await this.supabase.auth.getUser())
      await this.supabase.from("Products").insert({
        description: this.description,
        price: this.price,
        manufacturer: this.manufacturers.find((item) => {
          return item.manufacturer == this.manufacturer;
        })?.id,
        img: "",
        category: this.categories.find((item) => {
         return item.full_description == this.category;
        })?.id,
        vendor_code: this.vendor_code,
      }).then((res)=>console.log(res));
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
        console.log("MANUFACTURERS ", result);
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
  position: fixed; /* use fixed position */
  box-sizing: border-box;
  top: 50%; /* center vertically */
  left: 50%; /* center horizontally */
  transform: translate(-50%, -50%); /* adjust the position */
  margin: 0; /* remove any margin */
  border: 2px solid #0a3f6c; /* keep the border color */
  border-radius: 10px; /* add some rounded corners */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* add some shadow */
  padding: 20px; /* add some padding */
  background-color: white; /* add a background color */
  font-size: 18px; /* keep the font size */
  z-index: 4;
}

.product-creator h2 {
  color: #0a3f6c;
}
.overlay {
  position: fixed; /* use fixed position */
  top: 0; /* cover the whole screen */
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(
    0,
    0,
    0,
    0.5
  ); /* use a semi-transparent background color */
  backdrop-filter: blur(10px); /* use a blur filter */
  z-index: 2;
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
button, form  > input:last-of-type {
  color: #ffffff;
  background-color: #0a3f6c;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}
.close-button {
  position: absolute;
  right: 15px;
  color: #ffffff;
  background-color: #0a3f6c;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}
</style>
