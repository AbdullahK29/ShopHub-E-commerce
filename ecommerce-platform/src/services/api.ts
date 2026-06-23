// src/services/api.ts
// baseURL already includes /api
// So all calls use: api.get('/products'), api.post('/auth/login') etc
// NEVER add /api in the call itself

import axios from 'axios'

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || 'https://shophub-e-commerce-production.up.railway.app/api'
).replace(/\/$/, '')

const api = axios.create({
  baseURL: API_BASE_URL,
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

    // #region agent log
    //if (typeof window !== 'undefined') {
     // const fullUrl = `${config.baseURL || ''}${config.url || ''}`
     // fetch('http://127.0.0.1:7767/ingest/ef8ca279-c086-42d0-9dbd-71b1a938091c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'80a4ff'},body:JSON.stringify({sessionId:'80a4ff',location:'api.ts:request',message:'API request',data:{method:config.method,url:config.url,baseURL:config.baseURL,fullUrl,hasDoubleApi:fullUrl.includes('/api/api/')},timestamp:Date.now(),hypothesisId:'A',runId:'pre-fix'})}).catch(()=>{});
    //}
    // #endregion

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