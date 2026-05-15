import api from './api'

export const alojamientosService = {
  getAll:  (params) => api.get('/alojamientos', { params }),
  getById: (id)     => api.get(`/alojamientos/${id}`),
  crear:   (data)   => api.post('/alojamientos', data),
  editar:  (id, d)  => api.put(`/alojamientos/${id}`, d),
  eliminar:(id)     => api.delete(`/alojamientos/${id}`),
}
