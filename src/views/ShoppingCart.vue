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
            :src="`../img/${shoppingCart.cart.get(itemId - 1)?.product.img}`"
          />
        </td>
        <td>{{ shoppingCart.cart.get(itemId - 1)?.product.name }}</td>
        <td>{{ shoppingCart.cart.get(itemId - 1)?.product.id }}</td>
        <td>{{ "PRICE" }}</td>
        <td>{{ shoppingCart.cart.get(itemId - 1)?.amount }}</td>
        <td>{{ "SUM" }}</td>
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
              style="display: block"
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
              style="display: block"
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
  </div>
</template>
<script lang="ts">
import { useShoppingCartStore } from "@/stores/shoppingCart";
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      shoppingCart: useShoppingCartStore(),
    };
  },
  mounted() {
    console.log(this.shoppingCart.cart);
  },
});
</script>
<style scoped>
.cart-main-content {
  display: flex;
  flex-direction: column;
}
.cart-items {
  width: 70%;
  align-self: center;
}
.cart-items th, td {
  width: fit-content;
  text-align: center;
}
</style>
