import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast, { POSITION } from 'vue-toastification'
import router from './router'
import App from './App.vue'

// Estilos globales
import './assets/main.css'
import 'vue-toastification/dist/index.css'

const app = createApp(App)

// ── Pinia (estado global) ──────────────────────────────────
app.use(createPinia())

// ── Vue Router ────────────────────────────────────────────
app.use(router)

// ── Vue Toastification ────────────────────────────────────
app.use(Toast, {
  position: POSITION.TOP_RIGHT,
  timeout: 3500,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  hideProgressBar: false,
  maxToasts: 4,
  toastClassName: 'eco-toast',
})

// ── Montar la app ─────────────────────────────────────────
app.mount('#app')
