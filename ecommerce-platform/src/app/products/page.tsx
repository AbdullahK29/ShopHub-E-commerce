'use client'

import { useEffect, useState, useCallback } from 'react'
import ProductCard from '@/components/Product/ProductCard'
import { Product } from '@/types'
import { useDebounce } from '@/hooks/useDebounce'
import { productService } from '@/services/productService'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 400)

  const fetchProducts = useCallback(async () => {
    setLoading(true)

    try {
      const result = await productService.getAll({
        ...(category !== 'all' ? { category } : {}),
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
      })

      const items = result.data?.data || []
      setProducts(items)

      // #region agent log
      fetch('http://127.0.0.1:7767/ingest/ef8ca279-c086-42d0-9dbd-71b1a938091c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'80a4ff'},body:JSON.stringify({sessionId:'80a4ff',location:'products/page.tsx:fetchProducts',message:'products fetched',data:{count:items.length,category,search:debouncedSearch},timestamp:Date.now(),hypothesisId:'A',runId:'pre-fix'})}).catch(()=>{});
      // #endregion
    } catch (err) {
      // #region agent log
      fetch('http://127.0.0.1:7767/ingest/ef8ca279-c086-42d0-9dbd-71b1a938091c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'80a4ff'},body:JSON.stringify({sessionId:'80a4ff',location:'products/page.tsx:fetchProducts:catch',message:'products fetch failed',data:{error:err instanceof Error?err.message:'unknown'},timestamp:Date.now(),hypothesisId:'A',runId:'pre-fix'})}).catch(()=>{});
      // #endregion
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