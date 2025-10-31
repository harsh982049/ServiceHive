import axios from 'axios'
import { useAuth } from '@/store/auth'

// Create instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api',
})

// Attach token
api.interceptors.request.use((config) => {
  const { token } = useAuth.getState()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
