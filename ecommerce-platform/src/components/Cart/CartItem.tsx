'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { removeItem, updateQuantity } from '@/store/slices/cartSlice'
import { useToast } from '@/components/common/Toast'
import { CartItem as CartItemType } from '@/types'

interface CartItemProps {
  item: CartItemType
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
}

export default function CartItem({ item }: CartItemProps) {
  const dispatch      = useAppDispatch()
  const { showToast } = useToast()

  const price     = item.product.discountPrice ?? item.product.price
  const itemTotal = price * item.quantity

  const handleRemove = () => {
    dispatch(removeItem(item.product.id))
    showToast(`${item.product.name} removed from cart`, 'info')
  }

  const handleQuantityChange = (newQty: number) => {
    if (newQty < 1) return
    if (newQty > item.product.stockQuantity) {
      showToast(`Only ${item.product.stockQuantity} in stock`, 'warning')
      return
    }
    dispatch(updateQuantity({ productId: item.product.id, quantity: newQty }))
  }

  return (
    <div className="flex gap-4 py-6 border-b border-slate-100 last:border-0">

      {/* Product Image */}
      <Link href={`/products/${item.product.id}`} className="flex-shrink-0">
        <div className="relative w-24 h-24 bg-slate-50 rounded-xl overflow-hidden">
          <Image
            src={item.product.images[0]}
            alt={item.product.name}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <Link href={`/products/${item.product.id}`}>
          <h3 className="font-semibold text-slate-800 text-sm leading-tight hover:text-emerald-600 transition-colors line-clamp-2 mb-1">
            {item.product.name}
          </h3>
        </Link>
        <p className="text-xs text-slate-400 mb-3">{item.product.category.name}</p>

        <div className="flex items-center justify-between">
          {/* Quantity Controls */}
          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors font-semibold text-lg"
              disabled={item.quantity <= 1}
            >
              −
            </button>
            <span className="w-8 text-center text-sm font-semibold text-slate-800">
              {item.quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors font-semibold text-lg"
              disabled={item.quantity >= item.product.stockQuantity}
            >
              +
            </button>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="font-bold text-slate-900">{formatPrice(itemTotal)}</p>
            {item.quantity > 1 && (
              <p className="text-xs text-slate-400">{formatPrice(price)} each</p>
            )}
          </div>
        </div>
      </div>

      {/* Remove Button */}
      <button
        onClick={handleRemove}
        className="flex-shrink-0 self-start p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        aria-label="Remove item"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}