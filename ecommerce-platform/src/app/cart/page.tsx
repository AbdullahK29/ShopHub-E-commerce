'use client'

import Link from 'next/link'
import { useAppSelector } from '@/hooks/useAppSelector'
import { selectCartItems, selectCartTotal, selectCartItemCount } from '@/store/slices/cartSlice'
import CartItem from '@/components/Cart/CartItem'
import Button from '@/components/common/Button'

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
}

const SHIPPING_THRESHOLD = 50   // free shipping over $50
const SHIPPING_COST      = 9.99
const TAX_RATE           = 0.08 // 8%

export default function CartPage() {
  const items     = useAppSelector(selectCartItems)
  const total     = useAppSelector(selectCartTotal)
  const itemCount = useAppSelector(selectCartItemCount)

  const shipping  = total >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const tax       = total * TAX_RATE
  const orderTotal = total + shipping + tax

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Your cart is empty</h2>
          <p className="text-slate-500 mb-8">
            Looks like you haven't added anything yet. Start shopping to fill it up!
          </p>
          <Link href="/products">
            <Button label="Browse Products" size="lg" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Shopping Cart</h1>
          <p className="text-slate-500 mt-1">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-100 px-6">
              {items.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            {/* Continue Shopping */}
            <Link
              href="/products"
              className="inline-flex items-center gap-2 mt-4 text-sm text-emerald-600 font-medium hover:underline"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Continue shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-slate-800 mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal ({itemCount} items)</span>
                  <span className="font-medium text-slate-800">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Shipping</span>
                  {shipping === 0 ? (
                    <span className="text-emerald-600 font-medium">FREE</span>
                  ) : (
                    <span className="font-medium text-slate-800">{formatPrice(shipping)}</span>
                  )}
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Tax (8%)</span>
                  <span className="font-medium text-slate-800">{formatPrice(tax)}</span>
                </div>

                {/* Free shipping progress */}
                {shipping > 0 && (
                  <div className="bg-amber-50 rounded-xl p-3">
                    <p className="text-xs text-amber-700 mb-2">
                      Add <span className="font-bold">{formatPrice(SHIPPING_THRESHOLD - total)}</span> more for free shipping!
                    </p>
                    <div className="w-full bg-amber-200 rounded-full h-1.5">
                      <div
                        className="bg-amber-500 h-1.5 rounded-full transition-all"
                        style={{ width: `${Math.min((total / SHIPPING_THRESHOLD) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="border-t border-slate-100 pt-3 flex justify-between">
                  <span className="font-bold text-slate-800">Total</span>
                  <span className="font-bold text-xl text-slate-900">{formatPrice(orderTotal)}</span>
                </div>
              </div>

              <Link href="/checkout">
                <Button label="Proceed to Checkout" fullWidth size="lg" />
              </Link>

              {/* Security badges */}
              <div className="flex items-center justify-center gap-4 mt-4">
                <span className="text-xs text-slate-400">🔒 Secure checkout</span>
                <span className="text-xs text-slate-400">↩️ Free returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}