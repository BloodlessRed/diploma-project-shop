<template>
  <teleport to="body">
    <div class="overlay" v-if="show"></div>
    <form class="account-creator" v-show="show" @submit="submitAccount">
      <span @click="$emit('closePopUp', 'account')" class="close-button"
        >Закрыть</span
      >
      <h2>Создание аккаунта</h2>
      <!-- Column names for the company info and representative info -->
      <div class="column-names">
        <h3>Информация о компании</h3>
        <h3>Информация о представителе</h3>
      </div>
      <!-- Input elements for the company info and representative info -->
      <div class="input-elements">
        <!-- Input elements for the company info -->
        <div class="company-info">
          <div class="field">
            <label for="tax-id">ИНН:</label>
            <input id="tax-id" type="text" v-model="tax_id" required />
          </div>

          <div class="field">
            <label for="company-name">Полное название компании:</label>
            <input
              id="company-name"
              type="text"
              v-model="company_name"
              required
            />
          </div>

          <div class="field">
            <label for="city">Город:</label>
            <input id="city" type="text" v-model="city" required />
          </div>

          <div class="field">
            <label for="login">Логин:</label>
            <input
              id="login"
              type="text"
              v-model="login"
              required
              autocomplete="new-password"
            />
          </div>

          <div class="field">
            <label for="password">Пароль:</label>
            <input
              id="password"
              type="password"
              v-model="password"
              required
              autocomplete="new-password"
            />
          </div>
        </div>
        <!-- Input elements for the representative info -->
        <div class="representative-info">
          <div class="field">
            <label for="rep-name">ФИО представителя:</label>
            <input id="rep-name" type="text" v-model="rep_name" required />
          </div>

          <div class="field">
            <label for="rep-email">Email представителя:</label>
            <input id="rep-email" type="email" v-model="rep_email" required />
          </div>

          <div class="field">
            <label for="rep-phone">Телефон представителя:</label>
            <input id="rep-phone" type="tel" v-model="rep_phone" required />
          </div>
        </div>
      </div>
      <!-- Button for submitting the new account -->
      <input type="submit" placeholder="Создать аккаунт" />
    </form>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, inject } from "vue";
import type { SupabaseClient } from "@supabase/supabase-js";
import { useCurrentUserStore } from "@/stores/currentUser";

export default defineComponent({
  name: "AccountCreator",
  emits: ["closePopUp","updateOrders"],
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    info: {
      type: Object,
      default: () => ({}),
    },
  },
  // Receive the supabase prop from the parent component
  setup() {
    let supabase: SupabaseClient | undefined = inject("supabase");
    return { supabase };
  },
  data() {
    return {
      // Data properties for the company info fields
      tax_id: "",
      company_name: "",
      city: "",
      login: "",
      password: "",
      // Data properties for the representative info fields
      rep_name: "",
      rep_email: "",
      rep_phone: "",
      currentUser: useCurrentUserStore()
    };
  },
  methods: {
    // Method for submitting the new account
    async submitAccount(e: Event) {
      e.preventDefault();
      if (this.supabase == undefined) {
        return;
      }
      if (
        !(
          this.tax_id &&
          this.company_name &&
          this.city &&
          this.login &&
          this.password &&
          this.rep_name &&
          this.rep_email &&
          this.rep_phone
        )
      ) {
        alert("Заполните все необходимые поля!");
        return;
      }
      let [orgType, orgName] = this.company_name.split(/ (.*)/)
      orgName = orgName.slice(1,-1)
      console.log(orgType,' | ',orgName)
      let newUser = await this.supabase.auth.signUp({
        email: this.login,
        password: this.password,
        options: {
          data: {
            role: "client",
          },
        },
      });
      await this.supabase.auth.signOut()
      await this.supabase.auth.signInWithPassword({email:this.currentUser.userInfo.login, password:this.currentUser.userInfo.password})
      console.log("Created User ", newUser);
      console.log("Current user now is ", await this.supabase.auth.getUser())
      let representative = await this.supabase
        .from("Clients")
        .upsert({
          full_name: this.rep_name,
          email: this.rep_email,
          phone: this.rep_phone,
        },{
          onConflict:'phone'
        })
        .select()
        .single()
        .then((resp) => {console.log(resp); return resp.data});
      if (representative == null) {
        alert("Не удалось создать представителя. Попробуйте сохранить еще раз");
        return;
      }
      let companyInfo = {
        reference_to_secret: newUser.data.user?.id,
        tax_id: this.tax_id,
        full_name: this.company_name,
        city: this.city,
        login: this.login,
        password: this.password,
        representative: representative.id,
      };
      console.log(companyInfo);
      let company = await this.supabase
        .from("Companies")
        .insert(companyInfo)
        .select()
        .single()
        .then((resp) => {console.log(resp); return resp.data});
      if (company == null) {
        alert(
          "Не удалось завершить создание аккаунта. Попробуйте сохранить еще раз"
        );
        return;
      }
      console.log('%'+orgType+'%'+orgName+'%')
      let {data} = await this.supabase.from('Orders').select('order_id').ilike('note','%'+orgType+'%'+orgName+'%')
      if (data == undefined){
        alert(
          "Не удалось завершить создание аккаунта. Попробуйте сохранить еще раз"
        );
        return
      }
      let orderIdArr = data.map((elem)=>parseInt(elem.order_id))
      console.log(orderIdArr)
      console.log(company.id)
      await this.supabase.from('Orders').update({company_id:company.id}).in('order_id',orderIdArr).select('*').then((res)=>console.log(res))
      this.$emit('updateOrders',orderIdArr,company.id)
      alert(`Создание аккаунта ${this.login}`);
    },
  },
  watch: {
    info: {
      handler(newVal) {
        // Assign the new values from the info prop to the data properties
        this.tax_id = newVal.taxId || "";
        this.company_name = newVal.orgName || "";
        this.city = newVal.city || "";
        this.rep_name = newVal.fullName || "";
        this.rep_phone = newVal.phone || "";
        this.rep_email = newVal.email[0];
        console.log(newVal);
      },
      deep: true, // Watch for changes in nested properties
    },
  },
  mounted() {
    // Assign the values from the info prop to the data properties
    this.tax_id = this.info.taxId || "";
    this.company_name = this.info.orgName || "";
    this.city = this.info.city || "";
  },
});
</script>

<style scoped>
/* Account creator */
.account-creator {
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

.account-creator h2 {
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

/* Column names section */
.column-names {
  display: grid; /* use grid layout */
  grid-template-columns: repeat(2, 1fr); /* create two equal columns */
  gap: 10px; /* add some gap between the headings */
}

.column-names h3 {
  color: #0a3f6c;
  text-align: center;
}

/* Input elements section */
.input-elements {
  display: grid; /* use grid layout */
  grid-template-columns: repeat(2, 1fr); /* create two equal columns */
  gap: 10px; /* add some gap between the inputs */
}

/* Company info and representative info sections */
.company-info,
.representative-info {
  display: flex; /* use flexbox layout */
  flex-direction: column; /* arrange the inputs vertically */
}

/* Field */
.field {
  display: flex; /* use flexbox layout */
  align-items: center; /* align items vertically */
  justify-content: space-between; /* align items horizontally */
  margin-bottom: 10px; /* add some margin below the inputs */
}
.account-creator label {
  color: #0a3f6c;
  font-weight: bold;
}

.account-creator input,
.account-creator select {
  width: 200px;
}

/* Submit button */
button,
form > input:last-of-type {
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
