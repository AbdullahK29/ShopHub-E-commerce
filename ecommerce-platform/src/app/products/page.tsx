'use client'

import { useEffect, useState, useCallback } from 'react'
import ProductCard from '@/components/Product/ProductCard'
import { Product } from '@/types'
import { useDebounce } from '@/hooks/useDebounce'
import api from '@/services/api'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 400)

  const fetchProducts = useCallback(async () => {
    setLoading(true)

    try {
      const params = new URLSearchParams()

      if (category !== 'all') params.append('category', category)
      if (debouncedSearch) params.append('search', debouncedSearch)

      const res = await api.get(`/api/products?${params.toString()}`)

      setProducts(res.data?.data?.data || [])
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [category, debouncedSearch])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return (
    <div className="p-6">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search products..."
        className="border p-2 mb-4"
      />

      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No products found</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}