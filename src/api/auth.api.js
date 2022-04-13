import { api } from 'boot/axios'

export default {
  login: (data) => api.post('auth/login', data),
  getAllUsers: () => api.get('users/all'),
  register: (data) => api.post('auth/register', data),
  getAllRoles: () => api.get('users/roles'),
  deleteUser: (id) => api.delete(`users/${id}`),
}
