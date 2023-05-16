<template>
  <div class="login-container">
    <form>
      <div class="form-group">
        <label for="username" class="label">Email:</label>
        <input type="text" id="username" v-model="email" />
      </div>
      <div class="form-group">
        <label for="password" class="label">Password:</label>
        <input type="password" id="password" v-model="password" />
      </div>
      <div class="custom-button" @click.prevent="login">
        <span>Войти</span>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import type { SupabaseClient } from "@supabase/supabase-js";
import { defineComponent, inject } from "vue";

export default defineComponent({
  setup() {
    const supabase: SupabaseClient | undefined = inject("supabase");
    return {
      supabase,
    };
  },
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async login() {
      if (this.supabase != undefined) {
        await this.supabase.auth.signInWithPassword({
          email:this.email,
          password:this.password
        }).then(val=>console.log(val))
        let currentUser = await this.supabase.auth.getUser().then((val)=>{return val.data.user})
        if(currentUser != null && currentUser.user_metadata.role == 'manager'){
          this.$router.push({name:'ManagersPage', params:{manager:currentUser.email}})
        }
      }
    },
  },
});
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.label {
  width: 100px; /* or any fixed width you prefer */
  margin-right: 1rem; /* adjust the margin as needed */
}

.form-group {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 1rem;
}

input[type="text"],
input[type="password"] {
  padding: 0.5rem;
}
</style>
