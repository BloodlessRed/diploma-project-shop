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
              params: {
                product_id: getProductFromCart(itemId).product.vendorCode,
              },
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
    <form
      class="receipt-info"
      @submit="generateCommercialOffer($event)"
    >
      <div class="client-info">
        <div class="input-field-wrapper">
          <div class="separator">
            <label class="field-title"
              >ФИО <span class="mandatory-asterisk">*</span></label
            >
            <input
              v-model="fullName"
              maxlength="255"
              size="50"
              data-oneline=""
              type="text"
              class="inp"
              required
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
              maxlength="255"
              size="50"
              data-oneline=""
              type="text"
              class="inp"
              v-model.lazy="taxId"
              @change="search()"
              required
            />
          </div>
        </div>
        <div class="input-field-wrapper">
          <div class="separator">
            <label for="org_name_id" class="field-title">
              Организация
              <span class="mandatory-asterisk">*</span>
            </label>
            <input
              id="org_name_id"
              name="customf[company][value]"
              maxlength="255"
              size="50"
              data-oneline=""
              type="text"
              class="inp"
              required
              v-model="orgName"
            />
          </div>
        </div>
        <div class="input-field-wrapper">
          <div class="separator">
            <label class="field-title"
              >Эл. почта <span class="mandatory-asterisk">*</span></label
            >
            <input
              maxlength="255"
              size="50"
              data-oneline=""
              type="text"
              class="inp"
              v-model="email"
              required
            />
          </div>
        </div>
        <div class="input-field-wrapper">
          <div class="separator">
            <label class="field-title"
              >Телефон <span class="mandatory-asterisk">*</span></label
            >
            <input
              maxlength="255"
              size="50"
              data-oneline=""
              type="text"
              class="inp"
              v-model="phone"
              required
            />
          </div>
        </div>
        <div class="input-field-wrapper">
          <div class="separator">
            <label class="field-title">Город / Населенный пункт</label>
            <input
              name="customf[city][value]"
              maxlength="255"
              size="50"
              data-oneline=""
              type="text"
              class="inp"
              v-model="city"
            />
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
              v-model="comment"
            ></textarea>
          </div>
        </div>
        <div class="input-field-wrapper">
          <div class="separator">
            <div class="politika left">
              Отправляя форму, вы соглашаетесь<br />
              c
              <a target="_blank" href="/system/politika/"
                >кодексом деловой этики компании</a
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
        <input type="submit" value="Получить коммерческое предложение" />
      </div>
    </form>
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
  computed: {
    computed_sum(): number {
      return this.shoppingCart.totalSum;
    },
  },
  data() {
    return {
      orgName: "",
      taxId: "",
      fullName: "",
      email: "",
      phone: "",
      city: "",
      address: "",
      comment: "",
      shoppingCart: useShoppingCartStore(),
      productsForCO: [] as any[],
      base64Images: new Map<number, string>(),
    };
  },
  methods: {
    async search() {
      // Установить статус загрузки
      
      try {
        // Сформировать URL для запроса к API
        const url = `https://api.ofdata.ru/v2/company?key=6320DMGjtxv7yc4X&inn=${this.taxId}`;
        // Отправить запрос и получить ответ с помощью axios
        const response = await axios.get(url);
        // Проверить наличие данных в ответе
        if (
          response.data.data
        ) {
          // Получить первый элемент из массива данных
          const data = response.data.data;
          console.log("Данные с API", data)
          this.orgName = data.НаимСокр
          this.email = data.Контакты.Емэйл
          this.phone = data.Контакты.Тел[0]
          
        } else {
          // Если данных нет, то установить сообщение об ошибке
          alert("Компания с таким ИНН не найдена");
        }
      } catch (e: any) {
        // Если произошло исключение, то установить сообщение об ошибке
        alert("Что-то пошло не так! Попробуйте ввести ИНН еще раз или заполните данные вручную");
      } finally {
        // Сбросить статус загрузки
      }
    },
    fillTheProductsArray() {
      this.productsForCO.length = 0;
      this.shoppingCart.cart.forEach((value, key) => {
        this.productsForCO.push({
          prod_id: key + 1,
          prod_for_db: value.product.id,
          amount: value.amount,
          vendorCode: value.product.vendorCode,
          description: value.product.description,
          price: value.product.price,
          productSum: value.product.price * value.amount,
        });
      });
    },
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
    async generateCommercialOffer(event: Event) {
      event.preventDefault();
      if (this.supabase == undefined) {
        alert("Что-то пошло не так! Перезагрузите страницу");
        return;
      }
      this.fillTheProductsArray();
      if (
        !(
          this.orgName &&
          this.taxId &&
          this.fullName &&
          this.email &&
          this.phone
        )
      ) {
        alert(
          "Одно из обязательных полей не было заполнено. Заполните все необходимые поля"
        );
        return
      }
      let bearer;
      let origHeader = {
        alg: "HS256",
        typ: "JWT",
      };
      let origPlaceholder = {
        iss: "a9becc0e2dedc27a35a1c0b8e40efc185971bf0801c64bcd0b070c2087b55cf4",
        sub: "soshtau@gmail.com",
        exp: new Date(Date.now() + 10000).getTime(),
      };
      let API_SECRET_CODE =
        "c27cc38d04f65d1a92ccafbda06a065a49730820bde05879f95ecae3d14f898d";
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
      let manager = await this.supabase
        .from("managers_without_orders")
        .select("manager_id, full_name, job_title,phone_num")
        .limit(1)
        .single()
        .then((value) => {
          console.log(value);
          return value.data;
        });
      console.log("Now we have a manager ", manager);
      if (manager == null) {
        manager = await this.supabase
          .from("least_busy_manager")
          .select("manager_id,full_name,job_title,phone_num")
          .single()
          .then((leastBusyManager) => {
            console.log("YOUR MANAGER WILL BE: ", leastBusyManager.data);
            return leastBusyManager.data;
          });
      }
      if (manager == null) {
        alert("Что-то пошло не так! Перезагрузите страницу");
        return;
      }
      let preparedData = {
        docId: "001",
        currentDate: dateForCO.toLocaleString().split(",")[0],
        expirationDate: expirationDate.toLocaleString().split(",")[0],
        fullName: this.fullName,
        manager: manager.full_name,
        job_title: manager.job_title,
        phone_num: manager.phone_num,
        products: this.productsForCO,
      };
      let loader = this.$loading.show({
        active:true,
        isFullPage:true,
        zIndex:3,
        color:"#2e75b6"
      })
      await axios
        .post(
          "https://us1.pdfgeneratorapi.com/api/v4/documents/generate",
          {
            template: {
              id: "651733",
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
          return docLink;
        })
        .then((docLink) => {
          const fr = new FileReader();
          fr.onload = () => {
            let pdfString: string =
              fr.result?.toString() == undefined ? "" : fr.result.toString();
            console.log("SAVED STRING IS ", pdfString);
            this.saveOrderToDB(pdfString, manager);
          };
          fr.readAsDataURL(docLink);
        });
      loader.hide()
    },
    async saveOrderToDB(dockLink: string, manager: any) {
      if (this.supabase != undefined) {
        let note = {
          orgName: this.orgName,
          taxId: this.taxId,
          fullName: this.fullName,
          email: this.email,
          phone: this.phone,
          city: this.city,
          address: this.address,
          comment: this.comment,
        };
        let orderId = await this.supabase
          .from("Orders")
          .insert([
            {
              overall_price: this.shoppingCart.totalSum,
              document: dockLink,
              note: JSON.stringify(note),
              manager_id: manager.manager_id,
            },
          ])
          .select("order_id")
          .single()
          .then((value) => {
            return value.data;
          });
        let orderToProductsRows = this.productsForCO.map((element) => {
          return {
            order_id: orderId?.order_id,
            product_id: element.prod_for_db,
            amount: element.amount,
          };
        });
        console.log(orderToProductsRows);
        await this.supabase
          .from("OrderToProducts")
          .insert(orderToProductsRows)
          .then((value) => console.log(value));
      } else {
        console.log("Доступ к БД закрыт");
      }
    },
  },
  async mounted() {
    this.fillTheProductsArray();
    console.log("KEY ", this.shoppingCart.cart.keys);
    console.log("CURRENT PRODUCTS ", this.productsForCO);
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
.custom-button > span {
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
}
td > img {
  width: 50%;
  margin: 10px 0;
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
.cart-items > tr {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
}
.cart-items > tr > th,
td {
  flex: 1;
}
.cart-items > tr > th:nth-of-type(3),
td:nth-of-type(3) {
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
  margin: 0 0 10% 5%;
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
.sum-section span {
  font-size: 18px;
  font-weight: bolder;
}
.sum-section span:first-of-type {
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
