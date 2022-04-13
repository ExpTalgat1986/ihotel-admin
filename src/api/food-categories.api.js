import { api } from 'boot/axios'

export default {
  getAllFoodCategories: () => api.get('food-categories'),
  addFoodCategory: (data) => api.post('food-categories', data),
  changeFoodCategory: (data, id) => api.put(`food-categories/${id}`, data),
  deleteFoodCategory: (id) => api.delete(`food-categories/${id}`),
}
