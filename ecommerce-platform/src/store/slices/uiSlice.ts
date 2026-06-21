// src/store/slices/uiSlice.ts
// Manages UI-only state that needs to be shared across components
// (modals, drawers, loading states, search visibility)

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UIState {
  isSearchOpen: boolean
  activeModal: string | null   // which modal is open, null = none
}

const initialState: UIState = {
  isSearchOpen: false,
  activeModal: null,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSearch(state) { state.isSearchOpen = !state.isSearchOpen },
    openModal(state, action: PayloadAction<string>)  { state.activeModal = action.payload },
    closeModal(state) { state.activeModal = null },
  },
})

export const { toggleSearch, openModal, closeModal } = uiSlice.actions
export default uiSlice.reducer

export const selectIsSearchOpen = (state: { ui: UIState }) => state.ui.isSearchOpen
export const selectActiveModal  = (state: { ui: UIState }) => state.ui.activeModal