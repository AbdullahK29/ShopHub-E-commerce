// src/components/common/AuthInitializer.tsx
// This runs once when the app loads.
// It checks if there's a stored token, fetches the user profile,
// and restores the Redux auth state — so users stay logged in after refresh.

'use client'

import { useEffect } from 'react'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { loginSuccess, logout } from '@/store/slices/authSlice'
import api from '@/services/api'
import { User } from '@/types'

export default function AuthInitializer() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token')
      if (!token) return

      try {
        // Call the real backend to get the user profile
        const res = await api.get<{ data: User }>('/auth/me')
        dispatch(loginSuccess({ user: res.data.data, token }))
      } catch {
        // Token is invalid or expired — clear everything
        localStorage.removeItem('token')
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC'
        dispatch(logout())
      }
    }

    initAuth()
  }, [dispatch])

  return null // renders nothing — purely side effects
}