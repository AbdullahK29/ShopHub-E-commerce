// src/store/index.ts
// The central store — combines all slices into one state tree
//
// After this, your state shape looks like:
// {
//   cart:  { items: [], total: 0, itemCount: 0, isOpen: false }
//   auth:  { user: null, token: null, isLoading: false, error: null }
//   ui:    { isSearchOpen: false, activeModal: null }
// }

import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './slices/cartSlice'
import authReducer from './slices/authSlice'
import uiReducer   from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    ui:   uiReducer,
  },
})

// These types are used by useSelector and useDispatch for full TypeScript support
export type RootState   = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch