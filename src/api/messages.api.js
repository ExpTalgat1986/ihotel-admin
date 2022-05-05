import { api } from 'boot/axios'

export default {
  fetchMessages: (query) => api.get(`messages?${query}`),
  deleteMessage: (id) => api.delete(`messages/${id}`),
  getUnhandledMessagesCount: () => api.get('messages/unread'),
}
