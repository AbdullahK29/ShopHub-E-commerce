// src/services/productService.ts
import api from './api'
import { Product, PaginatedResponse, ApiResponse } from '@/types'

interface GetProductsParams {
  page?:     number
  limit?:    number
  category?: string
  search?:   string
  sortBy?:   string
  minPrice?: number
  maxPrice?: number
  minRating?: number
}

export const productService = {
  async getAll(params: GetProductsParams = {}): Promise<PaginatedResponse<Product>> {
    const res = await api.get<PaginatedResponse<Product>>('/products', { params })
    return res.data
  },

  async getById(id: string): Promise<Product> {
    const res = await api.get<ApiResponse<Product>>(`/products/${id}`)
    return res.data.data
  },

  async search(query: string): Promise<Product[]> {
    const res = await api.get<ApiResponse<Product[]>>('/products/search', {
      params: { q: query }
    })
    return res.data.data
  },

  async getByCategory(slug: string): Promise<Product[]> {
    const res = await api.get<ApiResponse<Product[]>>(`/products/category/${slug}`)
    return res.data.data
  },

  async getFeatured(): Promise<Product[]> {
    const res = await api.get<ApiResponse<Product[]>>('/products/featured')
    return res.data.data
  },
}