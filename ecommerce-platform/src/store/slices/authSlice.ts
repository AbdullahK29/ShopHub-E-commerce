// src/store/slices/authSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Called when login API returns successfully
    loginSuccess(state, action: PayloadAction<{ user: User; token: string }>) {
      state.user    = action.payload.user
      state.token   = action.payload.token
      state.isLoading = false
      state.error   = null
    },

    // Called when user logs out
    logout(state) {
      state.user  = null
      state.token = null
      state.error = null
    },

    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload
    },

    setError(state, action: PayloadAction<string>) {
      state.error     = action.payload
      state.isLoading = false
    },

    clearError(state) {
      state.error = null
    },
  },
})

export const { loginSuccess, logout, setLoading, setError, clearError } = authSlice.actions
export default authSlice.reducer

export const selectUser      = (state: { auth: AuthState }) => state.auth.user
export const selectToken     = (state: { auth: AuthState }) => state.auth.token
export const selectIsLoggedIn = (state: { auth: AuthState }) => !!state.auth.user
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading