import api from './api'

export const reservasService = {
  crear:            (data) => api.post('/reservas', data),
  getMisReservas:   ()     => api.get('/reservas/mis-reservas'),
  getPanelAnfitrion:()     => api.get('/reservas/panel'),
  cancelar:         (id)   => api.put(`/reservas/${id}/cancelar`),
  confirmar:        (id)   => api.put(`/reservas/${id}/confirmar`),
}
