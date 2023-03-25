<template>
  <div class="cart-main-content">
    <table class="cart-items">
      <tr>
        <th>Фото</th>
        <th>Название</th>
        <th>Артикул</th>
        <th>Цена</th>
        <th>Кол-во</th>
        <th>Сумма</th>
      </tr>
      <tr v-for="itemId in shoppingCart.cart.size">
        <td>
          <img
            ref="prodPic"
            :src="`../img/${
              getProductFromCart(itemId).product.img
            }-Nutrunners.svg`"
          />
        </td>
        <td class="product-name-wrapper">
          {{ getProductFromCart(itemId).product.name }}
        </td>
        <td>{{ getProductFromCart(itemId).product.vendorCode }}</td>
        <td>{{ getProductFromCart(itemId).product.price }}</td>
        <td>{{ getProductFromCart(itemId).amount }}</td>
        <td>
          {{
            getProductFromCart(itemId).amount *
            getProductFromCart(itemId).product.price
          }}
        </td>
      </tr>
    </table>
    <div class="client-info">
      <div class="input-field-wrapper">
        <div class="separator">
          <label class="field-title"
            >Организационная форма<span class="mandatory-asterisk"
              >*</span
            ></label
          >
          <select class="select-style none-important">
            <option value="ООО">ООО</option>
            <option value="ОАО">ОАО</option>
            <option value="ЗАО">ЗАО</option>
          </select>
        </div>
      </div>
      <div class="input-field-wrapper">
        <div class="separator">
          <label class="field-title">
            Организация
            <span class="mandatory-asterisk">*</span></label
          >
          <input
            name="customf[company][value]"
            value=""
            maxlength="255"
            size="50"
            data-oneline=""
            type="text"
            class="inp"
          />
        </div>
      </div>
      <div class="input-field-wrapper">
        <div class="separator">
          <label class="field-title">
            ИНН
            <span class="mandatory-asterisk">*</span></label
          >
          <input
            name="customf[inn][value]"
            value=""
            maxlength="255"
            size="50"
            data-oneline=""
            type="text"
            class="inp"
          />
        </div>
      </div>
      <div class="input-field-wrapper">
        <div class="separator">
          <label class="field-title"
            >ФИО <span class="mandatory-asterisk">*</span></label
          >
          <input
            name="customf[name][value]"
            value=""
            maxlength="255"
            size="50"
            data-oneline=""
            type="text"
            class="inp"
          />
        </div>
      </div>
      <div class="input-field-wrapper">
        <div class="separator">
          <label class="field-title"
            >Телефон <span class="mandatory-asterisk">*</span></label
          >
          <input
            name="customf[phone][value]"
            value=""
            maxlength="255"
            size="50"
            data-oneline=""
            type="text"
            class="inp"
          />
        </div>
      </div>
      <div class="input-field-wrapper">
        <div class="separator">
          <label class="field-title">Эл. почта</label>
          <input
            name="customf[email][value]"
            value=""
            maxlength="255"
            size="50"
            data-oneline=""
            type="text"
            class="inp"
          />
        </div>
      </div>
      <div class="input-field-wrapper">
        <div class="separator">
          <label class="field-title">Город / Населенный пункт</label>
          <input
            name="customf[city][value]"
            value=""
            maxlength="255"
            size="50"
            data-oneline=""
            type="text"
            class="inp"
          />
        </div>
      </div>
      <div class="input-field-wrapper">
        <div class="separator">
          <label class="field-title active">Адрес доставки</label>
          <textarea
            cols="501"
            rows="6"
            name="customf[address][value]"
            data-oneline=""
            placeholder="Индекс, область, населенный пункт, улица, дом, квартира"
            class="inp"
          ></textarea>
        </div>
      </div>
      <div class="input-field-wrapper">
        <div class="separator">
          <label class="field-title">Комментарий</label>
          <textarea
            cols="501"
            rows="6"
            name="customf[comments][value]"
            data-oneline=""
            class="inp"
          ></textarea>
        </div>
      </div>
      <div class="input-field-wrapper">
        <div class="separator">
          <label class="field-title active">Загрузить карту партнера</label>
          <div class="file-field">
            <input
              name="customfile_Загрузить карту партнера"
              value=""
              type="file"
            />
          </div>
        </div>
      </div>
      <div class="input-field-wrapper">
        <div class="separator">
          <div class="politika left">
            Отправляя форму, вы соглашаетесь<br />
            c
            <a target="_blank" href="/system/politika/"
              >политикой конфиденциальности</a
            >
          </div>
        </div>
      </div>
      <input
        type="submit"
        @click="generateCommercialOffer()"
        value="Получить коммерческое предложение"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { ShoppingCartProduct } from "@/model/ShoppingCartProduct";
import { useShoppingCartStore } from "@/stores/shoppingCart";
import axios from "axios";
import { SignJWT as signingTool } from "jose";
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      shoppingCart: useShoppingCartStore(),
      productsForCO: [] as unknown[],
      base64Images: new Map<number,string>()
    };
  },
  methods: {
    getProductFromCart(id: number): ShoppingCartProduct {
      let prod = this.shoppingCart.cart.get(id - 1);
      if (prod) {
        return prod;
      } else {
        return new ShoppingCartProduct();
      }
    },
    async generateCommercialOffer() {
      // this.productsForCO.forEach((value)=>{
        
      //   value.photo = this.base64Images.get(value.prod_id)
      //   console.log("looped id",value.photo)
        
      // })
      // console.log(this.productsForCO)
      let bearer;
      let origHeader = {
        alg: "HS256",
        typ: "JWT",
      };
      let origPlaceholder = {
        iss: "2f54bb29282370c33a91a939266213ec83ab13cc88dcb2507307db83cc4e6719",
        sub: "mms28042001@gmail.com",
        exp: new Date(Date.now() + 10000).getTime(),
      };
      let API_SECRET_CODE =
        "19b3212fa4c0a6c7c930285bf8bf7f363bbbe0689597f7c6a605a0d8bd085e11";
      let JWT = await new signingTool(origPlaceholder)
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("1h")
        .sign(new TextEncoder().encode(API_SECRET_CODE))
        .then((value) => {
          bearer = value;
        });
      //let bearerCode =
      //base64.encode(JSON.stringify(origHeader))+"."+base64.encode(JSON.stringify(origPlaceholder))+"."+base64.encode(API_SECRET_CODE)
      //btoa(JSON.stringify(origHeader)) + "." + btoa(JSON.stringify(origPlaceholder))+"."+API_SECRET_CODE
      // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIyZjU0YmIyOTI4MjM3MGMzM2E5MWE5MzkyNjYyMTNlYzgzYWIxM2NjODhkY2IyNTA3MzA3ZGI4M2NjNGU2NzE5Iiwic3ViIjoibW1zMjgwNDIwMDFAZ21haWwuY29tIiwiZXhwIjoxNjc5NTU3NTg4MzQ2fQ.B0dQD-LV1aXHg8YCfanHCC52fBm5icIIHpobLD-9VFA";
      let preparedData = {
        docId: "001",
        currentDate: new Date(Date.now()).toLocaleString().split(',')[0],
        products: this.productsForCO,
      };
      console.log(preparedData);
      console.log(bearer);
      await axios
        .post(
          "https://us1.pdfgeneratorapi.com/api/v4/documents/generate",
          {
            template: {
              id: "614636",
              data: preparedData,
            },
            format: "pdf",
            output: "url",
            name: "Invoice_Newton_M",
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + bearer,
            },
          }
        )
        .then((res) => {
          return res.data;
        })
        .then((data) => {
          axios
            .get(data.response, { responseType: "blob" })
            .then((response) => {
              const blob = new Blob([response.data], {
                type: "application/pdf",
              });
              const link = document.createElement("a");
              link.href = URL.createObjectURL(blob);
              link.download = "Invoice_Newton_M";
              link.click();
              URL.revokeObjectURL(link.href);
            });
        });
    },
  },
  async mounted() {
    console.log(this.shoppingCart.cart);
    let products = [];
    let image = this.$refs.prodPic;
    let imgBase64;
    this.shoppingCart.cart.forEach((value, key) => {
      products.push({
            prod_id: key,
            amount: value.amount,
            vendorCode: value.product.vendorCode,
            name: value.product.name,
            price: value.product.price,
            sum: value.product.price * value.amount,
            photo: "stub",
          });
        fetch(`../img/${value.product.img}-Nutrunners.svg`)
        .then((res) => res.blob())
        .then((blob) => {
            // Read the Blob as DataURL using the FileReader API
            const reader = new FileReader();
            reader.onloadend = () => {
                // Logs data:image/jpeg;base64,wL2dvYWwgbW9yZ...

                // Convert to Base64 string
                if(reader.result){
                const base64 = (reader.result);
                this.base64Images.set(key,base64.toString())
                console.log(base64);
                }
                
                // Logs wL2dvYWwgbW9yZ...
            };
            reader.readAsDataURL(blob);
        });
    });
    this.productsForCO = products
  },
});
</script>
<style scoped>
td > img {
  width: 150px;
}
.cart-main-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  flex-grow: 1;
}
.cart-items > tr:first-of-type {
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid rgba(122, 122, 122, 0.1);
}
.cart-items {
  border-collapse: collapse;
  border: 1px solid rgba(0, 0, 0, 0.1);
  width: 70%;
  align-self: center;
}
.cart-items th,
td {
  text-align: center;
}
.client-info {
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  align-self: center;
  width: 70%;
}
.client-info > input {
  background-color: #2e75b6;
  color: #ffffff;
  border: 0;
  height: 20%;
  width: 50%;
  align-self: center;
}
.product-name-wrapper {
  width: 55%;
}
.mandatory-asterisk {
  vertical-align: middle;
  margin: 0 3px;
  color: red;
  font-size: 14px;
}
.input-field-wrapper {
  display: flex;
  flex-direction: column;
}
.input-field-wrapper input,
textarea,
select {
  width: 450px;
}
.separator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 5px 0;
}
.field-title {
  margin: 0 20px;
  width: 15%;
  text-align: end;
}
</style>
