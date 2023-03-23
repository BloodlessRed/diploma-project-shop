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
            :src="`../img/${
              getProductFromCart(itemId).product.img
            }-Nutrunners.svg`"
          />
        </td>
        <td>{{ getProductFromCart(itemId).product.name }}</td>
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
      <div class="order-left">
        <div class="basket_blks">
          <div class="person_body">
            <div
              class="person_line person_type_select person_org none"
              data-optbody="2"
            >
              <div class="input-field-standart input-oneline">
                <label class="field-title"
                  >Организационная форма
                  <div class="red">*</div></label
                >
                <select
                  name="customf[org][value]"
                  data-oneline=""
                  class="select-style none-important"
                >
                  <option value="ООО">ООО</option>
                  <option value="ОАО">ОАО</option>
                  <option value="ЗАО">ЗАО</option>
                </select>
              </div>
            </div>
            <div
              class="person_line person_type_input person_company none"
              data-optbody="2"
            >
              <div class="input-field-standart input-oneline">
                <label class="field-title"
                  >Организация
                  <div class="red">*</div></label
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
            <div
              class="person_line person_type_input person_inn none"
              data-optbody="2"
            >
              <div class="input-field-standart input-oneline">
                <label class="field-title"
                  >ИНН
                  <div class="red">*</div></label
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
            <div class="person_line person_type_input person_name">
              <div class="input-field-standart input-oneline">
                <label class="field-title"
                  >ФИО
                  <div class="red">*</div></label
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
            <div class="person_line person_type_input person_phone">
              <div class="input-field-standart input-oneline">
                <label class="field-title"
                  >Телефон
                  <div class="red">*</div></label
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
            <div class="person_line person_type_input person_email">
              <div class="input-field-standart input-oneline">
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
            <div class="person_line person_type_input person_city">
              <div class="input-field-standart input-oneline">
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
            <div class="person_line person_type_textarea person_address">
              <div class="input-field-standart input-oneline">
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
            <div class="person_line person_type_textarea person_comments">
              <div class="input-field-standart input-oneline">
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
            <div
              class="person_line person_type_file person_Загрузить карту партнера"
            >
              <div class="file-standart input-oneline">
                <label class="field-title active"
                  >Загрузить карту партнера</label
                >
                <div class="file-field">
                  <input
                    name="customfile_Загрузить карту партнера"
                    value=""
                    type="file"
                  />
                </div>
              </div>
            </div>
            <div class="person_line person_politika">
              <div class="input-oneline">
                <div class="field-first"></div>
                <div class="field-second">
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
          </div>
        </div>
      </div>
    </div>
    <button @click="generateCommercialOffer()">
      Получить коммерческое предложение
    </button>
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
      console.log(bearer);
      await axios
        .post(
          "https://us1.pdfgeneratorapi.com/api/v4/documents/generate",
          {
            template: {
              id: "614636",
              data: {
                docId: "001",
                currentDate: new Date(),
              },
            },
            format: "pdf",
            output: "url",
            name: "Invoice 123",
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + bearer,
              // alg:"HS256",
              // typ:"JWT",
              // iss:"2f54bb29282370c33a91a939266213ec83ab13cc88dcb2507307db83cc4e6719",
              // sub:"mms28042001@gmail.com",
              // exp: 1586112639
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
              link.download = "Invoice 123";
              link.click();
              URL.revokeObjectURL(link.href);
            });
        });
    },
  },
  mounted() {
    console.log(this.shoppingCart.cart);
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
}
.cart-items {
  width: 70%;
  align-self: center;
}
.cart-items th,
td {
  width: fit-content;
  text-align: center;
}
.client-info {
  display: flex;
  flex-direction: column;
}
</style>
