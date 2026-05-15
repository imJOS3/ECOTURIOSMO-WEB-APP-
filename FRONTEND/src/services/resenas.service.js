import api from './api'

export const resenasService = {
  getByAlojamiento: (id)   => api.get(`/resenas/${id}`),
  crear:            (data) => api.post('/resenas', data),
}
