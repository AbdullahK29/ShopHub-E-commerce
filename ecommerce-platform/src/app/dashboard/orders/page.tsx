'use client'

import { useState, useEffect } from 'react'
import api from '@/services/api'

function formatPrice(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
}

interface Order {
  id: string
  orderNumber: string
  createdAt: string
  status: string
  totalAmount: number
  items: { id: string; quantity: number; unitPrice: number; product: { name: string; images: string[] } }[]
}

const statusColors: Record<string, string> = {
  DELIVERED:  'bg-emerald-100 text-emerald-700',
  SHIPPED:    'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-amber-100 text-amber-700',
  PAID:       'bg-purple-100 text-purple-700',
  PENDING:    'bg-slate-100 text-slate-600',
  CANCELLED:  'bg-red-100 text-red-700',
}

export default function OrdersPage() {
  const [orders, setOrders]         = useState<Order[]>([])
  const [isLoading, setIsLoading]   = useState(true)
  const [expandedOrder, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    api.get<{ data: { data: Order[] } }>('/orders')
      .then(res => setOrders(res.data.data?.data || []))
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 h-20 animate-pulse" />
        ))}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
        <span className="text-5xl mb-4 block">📦</span>
        <h3 className="font-bold text-slate-800 text-lg mb-2">No orders yet</h3>
        <p className="text-slate-500 text-sm">Your orders will appear here once you make a purchase.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h1 className="text-2xl font-bold text-slate-800">My Orders</h1>
        <p className="text-slate-500 mt-1">{orders.length} orders total</p>
      </div>

      {orders.map(order => (
        <div key={order.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <button
            onClick={() => setExpanded(expandedOrder === order.id ? null : order.id)}
            className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors text-left">
            <div className="flex items-center gap-4">
              <div>
                <p className="font-bold text-slate-800">{order.orderNumber}</p>
                <p className="text-sm text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[order.status] || statusColors.PENDING}`}>
                {order.status}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-800">{formatPrice(Number(order.totalAmount))}</span>
              <svg className={`w-4 h-4 text-slate-400 transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          {expandedOrder === order.id && (
            <div className="border-t border-slate-100 px-6 py-4">
              {order.items.map(item => (
                <div key={item.id} className="flex justify-between py-2 text-sm">
                  <span className="text-slate-700">{item.product.name} × {item.quantity}</span>
                  <span className="font-medium">{formatPrice(item.unitPrice * item.quantity)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}