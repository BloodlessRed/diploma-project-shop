<template>
  <div class="cart-main-content">
    <table class="cart-items">
      <tr>
        <th>Фото</th>
        <th>Артикул</th>
        <th>Описание</th>
        <th>Цена</th>
        <th>Кол-во</th>
        <th>Сумма</th>
      </tr>
      <tr v-for="itemId in Array.from(shoppingCart.cart.keys())">
        <td>
          <img
            ref="prodPic"
            :src="`../img/${
              getProductFromCart(itemId).product.img
            }-Nutrunners.svg`"
          />
        </td>
        <td>
          <router-link
            :to="{
              name: 'Product',
              params: { product_id: getProductFromCart(itemId).product.id },
            }"
            >{{ getProductFromCart(itemId).product.vendorCode }}</router-link
          >
        </td>
        <td class="product-name-wrapper">
          {{ getProductFromCart(itemId).product.description }}
        </td>
        <td>
          {{
            shoppingCart.formatPrice(getProductFromCart(itemId).product.price)
          }}
          rub
        </td>
        <td class="amount-cell">
          <div class="counter-wrapper">
            <div class="custom-button" @click="addToCart(itemId)">
              <span>+</span>
            </div>
            <div class="product-counter">
              {{ getProductFromCart(itemId).amount }}
            </div>
            <div class="custom-button" @click="removeFromCart(itemId)">
              <span>-</span>
            </div>
          </div>
        </td>
        <td>
          <b>
            {{
              shoppingCart.formatPrice(
                getProductFromCart(itemId).amount *
                  getProductFromCart(itemId).product.price
              )
            }}

            rub
          </b>
        </td>
      </tr>
    </table>
    <div class="receipt-info">
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
              v-model="fullName"
              name="customf[name][value]"
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
      </div>
      <div class="receipt-price">
        <div class="sum-section">
          <span>Итого:</span>
          <span>{{ shoppingCart.formatPrice(computed_sum) }} rub</span>
        </div>
        <input
          type="submit"
          @click="generateCommercialOffer()"
          value="Получить коммерческое предложение"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { ShoppingCartProduct } from "@/model/ShoppingCartProduct";
import { useShoppingCartStore } from "@/stores/shoppingCart";
import axios from "axios";
import { SignJWT as signingTool } from "jose";
import { defineComponent, inject } from "vue";
import type { SupabaseClient } from "@supabase/supabase-js";

export default defineComponent({
  setup() {
    const supabase: SupabaseClient | undefined = inject("supabase");
    return {
      supabase,
    };
  },
  computed:{
    computed_sum(): number{
      this.totalSum = this.shoppingCart.totalSum
      return this.totalSum
    }
  },
  data() {
    return {
      fullName: "",
      shoppingCart: useShoppingCartStore(),
      productsForCO: [] as unknown[],
      base64Images: new Map<number, string>(),
      totalSum: 0,
    };
  },
  methods: {
    getProductFromCart(id: number): ShoppingCartProduct {
      let prod = this.shoppingCart.cart.get(id);
      if (prod) {
        return prod;
      } else {
        return new ShoppingCartProduct();
      }
    },
    addToCart(prodId: number) {
      let retrievedProduct: ShoppingCartProduct =
        this.getProductFromCart(prodId);
      this.shoppingCart.addToCart(retrievedProduct.product);
    },
    removeFromCart(prodId: number) {
      let retrievedProduct: ShoppingCartProduct =
        this.getProductFromCart(prodId);
      this.shoppingCart.removeFromCart(retrievedProduct.product);
    },
    async generateCommercialOffer() {
      console.log("total sum ", this.totalSum);
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
      await new signingTool(origPlaceholder)
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("1h")
        .sign(new TextEncoder().encode(API_SECRET_CODE))
        .then((value) => {
          bearer = value;
        });
      let dateForCO = new Date(Date.now());
      let expirationDate = new Date(dateForCO);
      expirationDate.setMonth(expirationDate.getMonth() + 1);
      let preparedData = {
        docId: "001",
        currentDate: dateForCO.toLocaleString().split(",")[0],
        expirationDate: expirationDate.toLocaleString().split(",")[0],
        fullName: this.fullName,
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
          let docLink: Promise<Blob> = axios
            .get(data.response, { responseType: "blob" })
            .then((response) => {
              console.log(response);
              const blob = new Blob([response.data], {
                type: "application/pdf",
              });
              const link = document.createElement("a");
              link.href = URL.createObjectURL(blob);
              link.download = "Invoice_Newton_M";
              link.click();
              URL.revokeObjectURL(link.href);
              return blob;
            });
          return docLink
        })
        .then((docLink) => {
          const fr = new FileReader()
          fr.onload = ()=>{
            let pdfString: string = fr.result?.toString() == undefined ? "" : fr.result.toString()
            console.log("SAVED STRING IS ", pdfString)
            this.saveOrderToDB(pdfString)
          }
          fr.readAsDataURL(docLink)
        });
    },
    async saveOrderToDB(dockLink: string) {
      if (this.supabase != undefined) {
        await this.supabase
          .from("Orders")
          .insert([{ overall_price: this.totalSum, document: dockLink }])
          .then((value) => {
            console.log("After inserting data into Order table we get:", value);
          });
      } else {
        console.log("Доступ к БД закрыт");
      }
    },
  },
  async mounted() {
    this.totalSum = this.shoppingCart.totalSum;
    let products: unknown[] = [];
    let image = this.$refs.prodPic;
    let imgBase64;
    await this.shoppingCart.cart.forEach((value, key) => {
      products.push({
        prod_id: key,
        amount: value.amount,
        vendorCode: value.product.vendorCode,
        description: value.product.description,
        price: value.product.price,
        productSum: value.product.price * value.amount,
        photo: "stub",
      });
      fetch(`../img/${value.product.img}-Nutrunners.svg`)
        .then((res) => {
          return res.blob();
        })
        .then((blob) => {
          // Read the Blob as DataURL using the FileReader API
          const reader = new FileReader();
          reader.onloadend = () => {
            if (reader.result) {
              const base64 = reader.result;
              this.base64Images.set(key, base64.toString());
            }
          };
          reader.readAsDataURL(blob);
        });
    });
    console.log("KEY ", this.shoppingCart.cart.keys);
    console.log("CURRENT PRODUCTS ", products);
    this.productsForCO = products;
  },
});
</script>
<style scoped>
.product-counter {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #535c65;
  font-size: 16px;
  width: 26%;
  height: 30px;
  text-align: center;
  border: 0;
  font-weight: 500px;
  background: rgba(0, 0, 0, 0.03);
}
.counter-wrapper {
  display: flex;
  justify-content: center;
}
.custom-button {
  padding: 5px 10px;
}
.custom-button > span{
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
}
td > img {
  width: 50%;
  margin: 10px 0 ;
}
.cart-main-content {
  display: flex;
  flex-direction: column;
  width: 80%;
  align-self: center;
  flex-grow: 1;
  justify-content: center;
}
.cart-items > tr:first-of-type {
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid rgba(122, 122, 122, 0.1);
}
.cart-items  > tr {
  border-top: 1px solid rgba(0, 0, 0, 0.1); 
  display: flex;
  align-items: center;
}
.cart-items  > tr > th, td {
 flex: 1;
}
.cart-items  > tr > th:nth-of-type(3), td:nth-of-type(3) {
 flex: 3;
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
.amount-cell {
  width: 13%;
}
.receipt-info {
  display: flex;
  justify-content: space-evenly;
  align-self: center;
  width: 70%;
  margin: 20px 0;
}
.receipt-price {
  display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    width: 30%;
    margin: 0 0 20% 5%;
    border: 1px solid rgba(0, 0, 0, 0.1);
}
.receipt-price > input {
  font-size: 18px;
  background-color: #2e75b6;
  color: #ffffff;
  border: 0;
  border-radius: 4px;
  padding: 2%;
}
.client-info {
  border: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-self: center;
  flex: 1;
}
.sum-section span{
  font-size: 18px;
  font-weight: bolder;
}
.sum-section span:first-of-type{
  margin: 0 100px 0 0;
}
.product-name-wrapper {
  padding: 0 10px;
  width: 50%;
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
  width: 25%;
  text-align: end;
}
</style>
