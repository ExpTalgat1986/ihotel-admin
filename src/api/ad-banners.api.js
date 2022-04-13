import { api } from 'boot/axios'

export default {
  getAllAdBanners: () => api.get('advertisements'),
  addBanner: (data) => api.post('advertisements', data),
  changeBanner: (data, id) => api.put(`advertisements/${id}`, data),
  deleteBanner: (id) => api.delete(`advertisements/${id}`),
}
