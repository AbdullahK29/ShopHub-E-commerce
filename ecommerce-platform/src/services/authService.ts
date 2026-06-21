// src/services/authService.ts
import api from './api'
import { User } from '@/types'

interface LoginPayload    { email: string; password: string }
interface RegisterPayload { email: string; password: string; firstName: string; lastName: string }
interface AuthResponse    { user: User; token: string }

export const authService = {
  async login(data: LoginPayload): Promise<AuthResponse> {
    const res = await api.post<{ data: AuthResponse }>('/auth/login', data)
    // Save token to localStorage so request interceptor picks it up
    localStorage.setItem('token', res.data.data.token)
    return res.data.data
  },

  async register(data: RegisterPayload): Promise<AuthResponse> {
    const res = await api.post<{ data: AuthResponse }>('/auth/register', data)
    localStorage.setItem('token', res.data.data.token)
    return res.data.data
  },

  async getMe(): Promise<User> {
    const res = await api.get<{ data: User }>('/auth/me')
    return res.data.data
  },

  async forgotPassword(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email })
  },

  async resetPassword(token: string, password: string): Promise<void> {
    await api.post('/auth/reset-password', { token, password })
  },

  logout() {
    localStorage.removeItem('token')
  },
}