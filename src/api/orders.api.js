import { api } from 'boot/axios'

export default {
  getAllOrders: (query) => api.get(`orders?${query}`),
  getUnhandledOrdersCount: () => api.get('orders/unhandled'),
  addOrder: (data) => api.post('orders', data),
  changeOrder: (data, id) => api.put(`orders/${id}`, data),
  deleteOrder: (id) => api.delete(`orders/${id}`),
}
