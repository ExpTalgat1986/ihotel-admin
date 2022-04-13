import { api } from 'boot/axios'

export default {
  getAllSections: () => api.get('sections'),
  addSection: (data) => api.post('sections', data),
  changeSection: (data, id) => api.put(`sections/${id}`, data),
  deleteSection: (id) => api.delete(`sections/${id}`),
}
