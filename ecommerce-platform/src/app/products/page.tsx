'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import ProductCard from '@/components/Product/ProductCard'
import { SkeletonCard } from '@/components/common/Loader'
import { useDebounce } from '@/hooks/useDebounce'
import { Product } from '@/types'

const CATEGORIES = [
  { id: 'c1', name: 'Laptops',   slug: 'laptops'   },
  { id: 'c2', name: 'Audio',     slug: 'audio'     },
  { id: 'c3', name: 'Phones',    slug: 'phones'    },
  { id: 'c4', name: 'Tablets',   slug: 'tablets'   },
  { id: 'c5', name: 'Wearables', slug: 'wearables' },
  { id: 'c6', name: 'Monitors',  slug: 'monitors'  },
]

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'

export default function ProductsPage() {
  const [products, setProducts]             = useState<Product[]>([])
  const [total, setTotal]                   = useState(0)
  const [isLoading, setIsLoading]           = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy]                 = useState<SortOption>('featured')
  const [searchQuery, setSearchQuery]       = useState('')
  const [maxPrice, setMaxPrice]             = useState(2000)
  const [minRating, setMinRating]           = useState(0)

  const debouncedSearch = useDebounce(searchQuery, 400)

  const fetchProducts = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        limit:  '20',
        sortBy,
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        ...(debouncedSearch                && { search:   debouncedSearch }),
        ...(maxPrice < 2000               && { maxPrice:  String(maxPrice) }),
        ...(minRating > 0                 && { minRating: String(minRating) }),
      })

      const res  = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?${params}`)
      const data = await res.json()

      setProducts(data.data?.data  || [])
      setTotal(data.data?.total    || 0)
    } catch (err) {
      console.error('Failed to fetch products:', err)
    } finally {
      setIsLoading(false)
    }
  }, [selectedCategory, debouncedSearch, maxPrice, minRating, sortBy])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-1">All Products</h1>
          <p className="text-slate-500">{total} products found</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 flex gap-8">

        {/* Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 sticky top-24 space-y-8">

            <div>
              <h3 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wide">Search</h3>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input type="search" placeholder="Search products..."
                  value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wide">Category</h3>
              <div className="space-y-1">
                <button onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === 'all' ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}>
                  All Categories
                </button>
                {CATEGORIES.map(cat => (
                  <button key={cat.id} onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === cat.slug ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}>
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wide">
                Max Price: <span className="text-emerald-600">${maxPrice.toLocaleString()}</span>
              </h3>
              <input type="range" min={0} max={2000} step={50} value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                className="w-full accent-emerald-600" />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>$0</span><span>$2,000</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wide">Min Rating</h3>
              <div className="space-y-1">
                {[0, 4, 4.5, 4.8].map(rating => (
                  <button key={rating} onClick={() => setMinRating(rating)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${minRating === rating ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}>
                    <span className="text-amber-400">{'★'.repeat(Math.floor(rating) || 1)}</span>
                    <span>{rating === 0 ? 'Any rating' : `${rating}+`}</span>
                  </button>
                ))}
              </div>
            </div>

            <button onClick={() => { setSelectedCategory('all'); setSearchQuery(''); setMaxPrice(2000); setMinRating(0); setSortBy('featured') }}
              className="w-full text-sm text-slate-500 hover:text-red-500 transition-colors py-2">
              Reset all filters
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-slate-500">
              Showing <span className="font-medium text-slate-800">{products.length}</span> of {total} results
            </p>
            <select value={sortBy} onChange={e => setSortBy(e.target.value as SortOption)}
              className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">No products found</h3>
              <p className="text-slate-500 text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map(product => <ProductCard key={product.id} product={product} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}