import axios from "axios"

//this is axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// Add token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const register = async ({ username, email, password }) => {
  try {
    const response = await api.post('/api/auth/register', { username, email, password })
    localStorage.setItem('token', response.data.token)  // ← save token
    return response.data
  } catch (err) {
    console.log(err)
  }
}

export const login = async ({ email, password }) => {
  try {
    const response = await api.post('/api/auth/login', { email, password })
    localStorage.setItem('token', response.data.token)  // ← save token
    return response.data
  } catch (err) {
    console.log(err)
  }
}

export const logout = async () => {
  try {
    await api.post('/api/auth/logout')
    localStorage.removeItem('token')  // ← clear token
  } catch (err) {
    console.log(err)
  }
}

export const getMe = async () => {
  try {
    const response = await api.get('/api/auth/get-me')
    return response.data
  } catch (err) {
    console.log(err)
  }
}