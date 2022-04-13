import { api } from 'boot/axios'

export default {
  getAllHs: () => api.get('hotel-services'),
  addHs: (data) => api.post('hotel-services', data),
  changeHs: (data, id) => api.put(`hotel-services/${id}`, data),
  deleteHs: (id) => api.delete(`hotel-services/${id}`),

  getAllHsCategories: () => api.get('hs-categories'),
  addHsCategory: (data) => api.post('hs-categories', data),
  changeHsCategory: (data, id) => api.put(`hs-categories/${id}`, data),
  deleteHsCategory: (id) => api.delete(`hs-categories/${id}`),
}
