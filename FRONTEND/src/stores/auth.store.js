import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/auth.service'

export const useAuthStore = defineStore('auth', () => {
  // ── Estado ──────────────────────────────────────────────
  const token = ref(localStorage.getItem('eco_token') || null)
  const user  = ref(JSON.parse(localStorage.getItem('eco_user') || 'null'))

  // ── Getters ─────────────────────────────────────────────
  const isLoggedIn  = computed(() => !!token.value)
  const isTurista   = computed(() => user.value?.rol === 'turista')
  const isAnfitrion = computed(() => user.value?.rol === 'anfitrion')
  const isAdmin     = computed(() => user.value?.rol === 'admin')
  const userRole    = computed(() => user.value?.rol || null)

  // ── Actions ─────────────────────────────────────────────
  async function login(credentials) {
    const { data } = await authService.login(credentials)
    _setSession(data.data.token, data.data.user)
    return data.data.user
  }

  async function register(payload) {
    const { data } = await authService.register(payload)
    return data.data
  }

  async function logout() {
    try {
      await authService.logout()
    } finally {
      _clearSession()
    }
  }

  async function fetchMe() {
    const { data } = await authService.me()
    user.value = data.data
    localStorage.setItem('eco_user', JSON.stringify(data.data))
    return data.data
  }

  // ── Helpers internos ────────────────────────────────────
  function _setSession(newToken, newUser) {
    token.value = newToken
    user.value  = newUser
    localStorage.setItem('eco_token', newToken)
    localStorage.setItem('eco_user',  JSON.stringify(newUser))
  }

  function _clearSession() {
    token.value = null
    user.value  = null
    localStorage.removeItem('eco_token')
    localStorage.removeItem('eco_user')
  }

  return {
    token, user,
    isLoggedIn, isTurista, isAnfitrion, isAdmin, userRole,
    login, register, logout, fetchMe,
  }
})
