// src/store/slices/cartSlice.ts
// A "slice" = one feature's state + all its actions in one file
// Redux Toolkit uses Immer internally so we CAN write "mutating" code
// like state.items.push() — Immer converts it to immutable updates safely

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CartItem, Product } from '@/types'

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number    // total quantity across all items (e.g. 3 iPhones + 1 laptop = 4)
  isOpen: boolean      // is the cart sidebar/drawer open?
}

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
  isOpen: false,
}

// Helper — recalculates total and itemCount from items array
// Called after every mutation to keep derived values in sync
function recalculate(state: CartState) {
  state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0)
  state.total     = state.items.reduce((sum, item) => {
    const price = item.product.discountPrice ?? item.product.price
    return sum + price * item.quantity
  }, 0)
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {

    // Add a product — if already in cart, increment quantity
    addItem(state, action: PayloadAction<Product>) {
      const product = action.payload
      const existing = state.items.find(item => item.product.id === product.id)

      if (existing) {
        existing.quantity += 1
      } else {
        state.items.push({
          id: `cart-${product.id}-${Date.now()}`,
          product,
          quantity: 1,
        })
      }
      recalculate(state)
    },

    // Remove a product completely from cart
    removeItem(state, action: PayloadAction<string>) {
      // action.payload = product id
      state.items = state.items.filter(item => item.product.id !== action.payload)
      recalculate(state)
    },

    // Set a specific quantity (used by quantity input in cart)
    updateQuantity(state, action: PayloadAction<{ productId: string; quantity: number }>) {
      const { productId, quantity } = action.payload
      const item = state.items.find(i => i.product.id === productId)

      if (item) {
        if (quantity <= 0) {
          // Remove if quantity set to 0
          state.items = state.items.filter(i => i.product.id !== productId)
        } else {
          item.quantity = quantity
        }
      }
      recalculate(state)
    },

    // Empty the entire cart (after successful order)
    clearCart(state) {
      state.items = []
      state.total = 0
      state.itemCount = 0
    },

    // Toggle cart drawer open/closed
    toggleCart(state) {
      state.isOpen = !state.isOpen
    },

    openCart(state)  { state.isOpen = true  },
    closeCart(state) { state.isOpen = false },
  },
})

// Export actions — components import these to dispatch
export const {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  toggleCart,
  openCart,
  closeCart,
} = cartSlice.actions

// Export reducer — goes into the store
export default cartSlice.reducer

// Export selectors — components import these to read state
// Selectors are functions: (state) => the piece you want
export const selectCartItems     = (state: { cart: CartState }) => state.cart.items
export const selectCartTotal     = (state: { cart: CartState }) => state.cart.total
export const selectCartItemCount = (state: { cart: CartState }) => state.cart.itemCount
export const selectCartIsOpen    = (state: { cart: CartState }) => state.cart.isOpen