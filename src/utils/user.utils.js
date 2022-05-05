export const ADMIN_ID = 2
export const MANAGER_ID = 1

export const setUser = (user) => {
  localStorage.setItem('ihotel_user', JSON.stringify(user))
}

export const getUser = () => {
  const user = localStorage.getItem('ihotel_user')
  return JSON.parse(user)
}

export const deleteUser = () => {
  localStorage.removeItem('ihotel_user')
}
