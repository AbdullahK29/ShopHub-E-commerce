// src/services/cartService.ts
import api from './api'
import { Cart, CartItem } from '@/types'
import { ApiResponse } from '@/types'

export const cartService = {
  async getCart(): Promise<Cart> {
    const res = await api.get<ApiResponse<Cart>>('/cart')
    return res.data.data
  },

  async addItem(productId: string, quantity: number): Promise<Cart> {
    const res = await api.post<ApiResponse<Cart>>('/cart/items', { productId, quantity })
    return res.data.data
  },

  async updateItem(productId: string, quantity: number): Promise<Cart> {
    const res = await api.put<ApiResponse<Cart>>(`/cart/items/${productId}`, { quantity })
    return res.data.data
  },

  async removeItem(productId: string): Promise<Cart> {
    const res = await api.delete<ApiResponse<Cart>>(`/cart/items/${productId}`)
    return res.data.data
  },

  async clearCart(): Promise<void> {
    await api.delete('/cart')
  },

  // Called when user logs in — merges their localStorage cart with DB cart
  async syncCart(items: CartItem[]): Promise<Cart> {
    const res = await api.post<ApiResponse<Cart>>('/cart/sync', { items })
    return res.data.data
  },
}