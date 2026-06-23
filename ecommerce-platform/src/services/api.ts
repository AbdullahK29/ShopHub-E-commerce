// src/services/api.ts
// baseURL already includes /api
// So all calls use: api.get('/products'), api.post('/auth/login') etc
// NEVER add /api in the call itself

import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://shophub-e-commerce-production.up.railway.app/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined'
      ? localStorage.getItem('token')
      : null

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC'
        window.location.href = '/login'
      }
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong'

    return Promise.reject(new Error(message))
  }
)

export default api