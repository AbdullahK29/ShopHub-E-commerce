// src/services/api.ts
// The Axios instance — the foundation of all API calls.
// Every service imports this instead of raw axios.

import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 10000,           // fail after 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
})

// REQUEST INTERCEPTOR
// Runs before every request is sent
// Automatically attaches the JWT token so you never have to add it manually
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
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

// RESPONSE INTERCEPTOR
// Runs after every response comes back
// Handles auth errors globally — no need to check 401 in every component
api.interceptors.response.use(
  (response) => response,   // success — just pass through
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear storage and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
    }

    // Format error message consistently
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong'

    return Promise.reject(new Error(message))
  }
)

export default api