'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Product } from '@/types'
import Badge from '@/components/common/Badge'
import Button from '@/components/common/Button'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { addItem } from '@/store/slices/cartSlice'
import { useToast } from '@/components/common/Toast'

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'

function StarRating({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1,2,3,4,5].map((star) => (
          <svg key={star} className={`w-3.5 h-3.5 ${rating >= star ? 'text-amber-400' : 'text-slate-200'}`}
            fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
          </svg>
        ))}
      </div>
      <span className="text-xs text-slate-500">({reviewCount.toLocaleString()})</span>
    </div>
  )
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [addedToCart, setAddedToCart]   = useState(false)
  const [imgSrc, setImgSrc]             = useState(product.images[0] || FALLBACK_IMAGE)
  
  const dispatch = useAppDispatch()
  const { showToast } = useToast()

  const isOnSale    = !!product.discountPrice && product.discountPrice < product.price
  const currentPrice = isOnSale ? product.discountPrice! : product.price
  const discountPct  = isOnSale
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0

  const handleAddToCart = () => {
    dispatch(addItem(product))           // updates Redux store
    showToast(`${product.name} added to cart!`, 'success')  // shows toast
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
 }

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">

      {/* Image */}
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square bg-slate-50 overflow-hidden">
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            onError={() => setImgSrc(FALLBACK_IMAGE)}
          />
          {isOnSale && (
            <div className="absolute top-3 left-3">
              <Badge label={`-${discountPct}%`} variant="danger" />
            </div>
          )}
          {product.stockQuantity === 0 && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <Badge label="Out of Stock" variant="neutral" />
            </div>
          )}
        </div>
      </Link>

      {/* Wishlist */}
      <button
        onClick={() => setIsWishlisted(!isWishlisted)}
        className="absolute top-3 right-3 p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-all opacity-0 group-hover:opacity-100"
        aria-label="Toggle wishlist"
      >
        <svg className={`w-4 h-4 ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-slate-400'}`}
          stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-slate-400 uppercase tracking-wide mb-1 font-medium">
          {product.category.name}
        </p>
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-slate-800 text-sm leading-tight mb-2 hover:text-emerald-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <div className="mb-3">
          <StarRating rating={product.rating} reviewCount={product.reviewCount} />
        </div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg font-bold text-slate-900">{formatPrice(currentPrice!)}</span>
          {isOnSale && (
            <span className="text-sm text-slate-400 line-through">{formatPrice(product.price)}</span>
          )}
        </div>
        {product.stockQuantity > 0 && product.stockQuantity <= 5 && (
          <p className="text-xs text-amber-600 font-medium mb-3">
            Only {product.stockQuantity} left!
          </p>
        )}
        <Button
          label={addedToCart ? 'Added ✓' : 'Add to Cart'}
          onClick={handleAddToCart}
          variant={addedToCart ? 'secondary' : 'primary'}
          fullWidth
          disabled={product.stockQuantity === 0}
          size="sm"
        />
      </div>
    </div>
  )
}