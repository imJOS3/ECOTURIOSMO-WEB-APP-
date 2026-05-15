import { defineStore } from 'pinia'
import { ref } from 'vue'
import { alojamientosService } from '@/services/alojamientos.service'

export const useAlojamientosStore = defineStore('alojamientos', () => {
  // ── Estado ──────────────────────────────────────────────
  const lista    = ref([])
  const detalle  = ref(null)
  const loading  = ref(false)
  const error    = ref(null)
  const filtros  = ref({ categoria: '', ubicacion: '', precio_max: '', page: 1, limit: 12 })

  // ── Actions ─────────────────────────────────────────────
  async function fetchAll(params = {}) {
    loading.value = true
    error.value   = null
    try {
      const query = { ...filtros.value, ...params }
      const { data } = await alojamientosService.getAll(query)
      lista.value = data.data
    } catch (err) {
      error.value = err.userMessage
    } finally {
      loading.value = false
    }
  }

  async function fetchById(id) {
    loading.value = true
    error.value   = null
    detalle.value = null
    try {
      const { data } = await alojamientosService.getById(id)
      detalle.value = data.data
    } catch (err) {
      error.value = err.userMessage
    } finally {
      loading.value = false
    }
  }

  async function crear(payload) {
    const { data } = await alojamientosService.crear(payload)
    return data.data
  }

  async function editar(id, payload) {
    const { data } = await alojamientosService.editar(id, payload)
    return data.data
  }

  function setFiltros(nuevos) {
    filtros.value = { ...filtros.value, ...nuevos, page: 1 }
  }

  function resetFiltros() {
    filtros.value = { categoria: '', ubicacion: '', precio_max: '', page: 1, limit: 12 }
  }

  return { lista, detalle, loading, error, filtros, fetchAll, fetchById, crear, editar, setFiltros, resetFiltros }
})
