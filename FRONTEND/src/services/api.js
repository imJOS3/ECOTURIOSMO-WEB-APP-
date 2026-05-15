import axios from 'axios'

// ── Instancia base ───────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// ── Interceptor de REQUEST — adjunta el token JWT ────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('eco_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Interceptor de RESPONSE — maneja errores globalmente ─
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status

    // Token expirado o inválido → limpiar sesión y redirigir
    if (status === 401) {
      localStorage.removeItem('eco_token')
      localStorage.removeItem('eco_user')
      // Evitar loop si ya estamos en /login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    // 403 — sin permisos (el componente lo maneja con el mensaje)
    // 404 — no encontrado
    // 500 — error de servidor

    // Propagar el error con el mensaje del backend si existe
    const message =
      error.response?.data?.message || 'Error de conexión con el servidor'
    error.userMessage = message

    return Promise.reject(error)
  }
)

export default api
