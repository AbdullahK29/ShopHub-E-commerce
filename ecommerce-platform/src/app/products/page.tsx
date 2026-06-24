'use client'

import { useEffect, useState, useCallback } from 'react'
import ProductCard from '@/components/Product/ProductCard'
import { Product } from '@/types'
import { useDebounce } from '@/hooks/useDebounce'
import { productService } from '@/services/productService'

const CATEGORIES = [
  { label: 'All',       value: 'all'       },
  { label: 'Laptops',   value: 'laptops'   },
  { label: 'Audio',     value: 'audio'     },
  { label: 'Phones',    value: 'phones'    },
  { label: 'Tablets',   value: 'tablets'   },
  { label: 'Wearables', value: 'wearables' },
  { label: 'Monitors',  value: 'monitors'  },
]

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading,  setLoading]  = useState(true)
  const [total,    setTotal]    = useState(0)
  const [category, setCategory] = useState('all')
  const [search,   setSearch]   = useState('')

  const debouncedSearch = useDebounce(search, 400)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const result = await productService.getAll({
        limit: 50,
        ...(category !== 'all'  ? { category }              : {}),
        ...(debouncedSearch     ? { search: debouncedSearch } : {}),
      })
      const items = result.data?.data || []
      setProducts(items)
      setTotal(result.data?.total || items.length)
    } catch {
      setProducts([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [category, debouncedSearch])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">All Products</h1>
          {!loading && (
            <p className="text-slate-500 mt-1">{total} products found</p>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          />
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  category === cat.value
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-emerald-400'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 aspect-square animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg">No products found</p>
            <button
              onClick={() => { setSearch(''); setCategory('all') }}
              className="mt-4 text-emerald-600 text-sm underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}