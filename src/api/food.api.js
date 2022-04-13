import { api } from 'boot/axios'

export default {
  getAllFoods: () => api.get('foods'),
  addFood: (data) => api.post('foods', data),
  changeFood: (data, id) => api.put(`foods/${id}`, data),
  deleteFood: (id) => api.delete(`foods/${id}`),
}
