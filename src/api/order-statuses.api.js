import { api } from 'boot/axios'

export default {
  getAllOrderStatuses: () => api.get('order-statuses'),
  addOrderStatuses: (data) => api.post('order-statuses', data),
  changeOrderStatuses: (data, id) => api.put(`order-statuses/${id}`, data),
  deleteOrderStatuses: (id) => api.delete(`order-statuses/${id}`),
}
