'use client'

import { useState, useEffect, use } from 'react'  // ← add 'use'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { addItem } from '@/store/slices/cartSlice'
import { useToast } from '@/components/common/Toast'
import Button from '@/components/common/Button'
import Badge from '@/components/common/Badge'
import { SkeletonCard } from '@/components/common/Loader'
import { Product } from '@/types'
import { API_BASE_URL } from '@/services/api'

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
}

// ← params is now a Promise in Next.js 15+
export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)  // ← unwrap the Promise with React.use()
  
  const [product, setProduct]             = useState<Product | null>(null)
  const [isLoading, setIsLoading]         = useState(true)
  const [notFoundError, setNotFoundError] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity]           = useState(1)
  const [isAdding, setIsAdding]           = useState(false)

  const dispatch      = useAppDispatch()
  const { showToast } = useToast()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/products/${id}`)
        if (res.status === 404) { setNotFoundError(true); return }
        const data = await res.json()
        setProduct(data.data)
      } catch {
        setNotFoundError(true)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProduct()
  }, [id])  // ← use id, not params.id

  if (notFoundError) notFound()

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <SkeletonCard />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-6 bg-slate-200 rounded animate-pulse" style={{ width: `${80 - i * 10}%` }} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!product) return null

  const isOnSale     = !!product.discountPrice && product.discountPrice < product.price
  const currentPrice = isOnSale ? product.discountPrice! : product.price
  const discountPct  = isOnSale
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) dispatch(addItem(product))
    showToast(`${product.name} added to cart!`, 'success')
    setIsAdding(true)
    setTimeout(() => setIsAdding(false), 1500)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link href="/" className="hover:text-emerald-600">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-emerald-600">Products</Link>
          <span>/</span>
          <span className="text-slate-800 font-medium line-clamp-1">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden border border-slate-100">
              <Image src={product.images[selectedImage] || product.images[0]}
                alt={product.name} fill className="object-cover" priority
                sizes="(max-width: 1024px) 100vw, 50vw" />
              {isOnSale && (
                <div className="absolute top-4 left-4">
                  <Badge label={`-${discountPct}%`} variant="danger" size="md" />
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${selectedImage === i ? 'border-emerald-500' : 'border-slate-200'}`}>
                    <Image src={img} alt={`View ${i + 1}`} fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Badge label={product.category.name} variant="info" />
              {product.stockQuantity === 0
                ? <Badge label="Out of Stock" variant="danger" dot />
                : product.stockQuantity <= 5
                ? <Badge label={`Only ${product.stockQuantity} left`} variant="warning" dot />
                : <Badge label="In Stock" variant="success" dot />}
            </div>

            <h1 className="text-3xl font-bold text-slate-900 leading-tight">{product.name}</h1>

            <div className="flex items-center gap-3">
              <div className="flex">
                {[1,2,3,4,5].map(star => (
                  <svg key={star} className={`w-5 h-5 ${product.rating >= star ? 'text-amber-400' : 'text-slate-200'}`}
                    fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                ))}
              </div>
              <span className="font-semibold">{product.rating}</span>
              <span className="text-slate-400 text-sm">({product.reviewCount.toLocaleString()} reviews)</span>
            </div>

            <div className="flex items-end gap-3">
              <span className="text-4xl font-bold text-slate-900">{formatPrice(currentPrice!)}</span>
              {isOnSale && (
                <>
                  <span className="text-xl text-slate-400 line-through pb-1">{formatPrice(product.price)}</span>
                  <span className="text-emerald-600 font-semibold pb-1">
                    Save {formatPrice(product.price - product.discountPrice!)}
                  </span>
                </>
              )}
            </div>

            <p className="text-slate-600 leading-relaxed">{product.description}</p>
            <hr className="border-slate-100" />

            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-700">Quantity:</span>
              <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-50 font-semibold text-lg"
                  disabled={quantity <= 1}>−</button>
                <span className="px-4 py-2 font-semibold text-center min-w-[40px]">{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(product.stockQuantity, q + 1))}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-50 font-semibold text-lg"
                  disabled={quantity >= product.stockQuantity}>+</button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button label={isAdding ? 'Added! ✓' : 'Add to Cart'}
                onClick={handleAddToCart}
                variant={isAdding ? 'secondary' : 'primary'}
                size="lg" fullWidth
                disabled={product.stockQuantity === 0} />
              <button className="px-4 py-3 border-2 border-slate-200 rounded-lg text-slate-600 hover:border-red-300 hover:text-red-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              {[{ icon: '🔒', text: 'Secure Payment' }, { icon: '📦', text: 'Free Returns' }, { icon: '⚡', text: 'Fast Delivery' }].map(b => (
                <div key={b.text} className="flex flex-col items-center gap-1 p-3 bg-slate-50 rounded-xl text-center">
                  <span className="text-xl">{b.icon}</span>
                  <span className="text-xs text-slate-600 font-medium">{b.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}