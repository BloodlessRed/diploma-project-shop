<template>
  <div class="login-container">
    <form>
      <div class="form-group">
        <label for="username" class="label">Username:</label>
        <input type="text" id="username" v-model="username" />
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
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    login() {
      // Your login logic goes here, for example:
      if (this.username === "user" && this.password === "password") {
        alert("Login successful!");
        this.$router.push({name:'ManagersPage', params:{manager:this.username}})
      } else {
        alert("Invalid credentials!");
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
