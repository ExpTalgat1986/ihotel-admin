import { api } from 'boot/axios'

export default {
  getAllAdServiceCategories: () => api.get('ad-service-categories'),
  addAdServiceCategory: (data) => api.post('ad-service-categories', data),
  changeAdServiceCategory: (data, id) => api.put(`ad-service-categories/${id}`, data),
  deleteAdServiceCategory: (id) => api.delete(`ad-service-categories/${id}`),

  getAllAdServices: () => api.get('ad-services'),
  addAdService: (data) => api.post('ad-services', data),
  changeAdService: (data, id) => api.put(`ad-services/${id}`, data),
  deleteAdService: (id) => api.delete(`ad-services/${id}`),
}
