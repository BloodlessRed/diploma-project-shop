<template>
  <div class="login-container">
    <h1>Введите свои данные для доступа к аккаунту</h1>
    <form class="login-form">
      <div class="form-group">
        <label for="username" class="label">Email:</label>
        <input type="text" id="username" v-model="email" />
      </div>
      <div class="form-group">
        <label for="password" class="label">Password:</label>
        <input type="password" id="password" v-model="password" />
      </div>
      <div class="form-group">
        <button type="submit" class="custom-button" @click.prevent="login">
          Войти
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { useCurrentUserStore } from "@/stores/currentUser";
import type { SupabaseClient } from "@supabase/supabase-js";
import { defineComponent, inject } from "vue";
export default defineComponent({
  setup() {
    const supabase: SupabaseClient | undefined = inject("supabase");
    return { supabase };
  },
  data() {
    return {
      email: "",
      password: "",
      user:useCurrentUserStore()
    };
  },
  methods: {
    async login() {
      if (this.supabase != undefined) {
        await this.supabase.auth
          .signInWithPassword({ email: this.email, password: this.password })
          .then((val) => console.log(val));
        let currentUser = await this.supabase.auth.getUser().then((val) => {
          return val.data.user;
        });
        if (currentUser != null) {
          this.user.setNewUser(currentUser)
          if(currentUser.user_metadata.role == "manager"){
            this.$router.push({
            name: "ManagersPage",
            params: { manager: currentUser.email },
          });
          }
        }
      }
    },
  },
});
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
}

h1 {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #2e75b6;
}

.login-form {
  width: 400px;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  color: #0a3f6c;
}

.label {
  display: block;
  margin-bottom: 0.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 1rem;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 0.5rem;
  border: none;
  border-bottom: 2px solid #5c9bcf;
  outline: none;
}

.custom-button {
  width: 100%;
  padding: 0.5rem;
  border-radius: 5px;
  border: none;
  background-color: #2e75b6;
  color: #ffffff;
  font-weight: bold;
  cursor: pointer;
}
</style>
