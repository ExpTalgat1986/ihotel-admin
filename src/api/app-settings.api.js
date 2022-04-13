import { api } from 'boot/axios'

export default {
  getAppSetting: () => api.get('system-settings'),
  setAppSettings: (data) => api.post('system-settings', data),
  changeAppSettings: (data) => api.put('system-settings', data),
}
