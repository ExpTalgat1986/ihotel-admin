import { api } from 'boot/axios'

export default {
  getAllNotifications: () => api.get('notifications'),
  addNotification: (data) => api.post('notifications', data),
  changeNotification: (data, id) => api.put(`notifications/${id}`, data),
  deleteNotification: (id) => api.delete(`notifications/${id}`),
}
