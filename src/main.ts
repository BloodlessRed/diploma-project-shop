import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import {LoadingPlugin} from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';

import './assets/main.css'
import { createClient } from '@supabase/supabase-js'
window.sessionStorage.clear
const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)
const app = createApp(App)
const supabaseUrl = "https://pamxsrdnxuqjelrudpca.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhbXhzcmRueHVxamVscnVkcGNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODI0MzI4NDEsImV4cCI6MTk5ODAwODg0MX0.OV31fqjnNfL-x5vptKOQf2IQdHl978jZjmIVz9dJuwg"
const supabase = createClient(supabaseUrl,supabaseKey)
app.provide('supabase',supabase)
app.use(pinia)
app.use(LoadingPlugin)
app.use(router)

app.mount('#app')