'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useAppSelector } from '@/hooks/useAppSelector'
import { selectCartItemCount, selectCartTotal } from '@/store/slices/cartSlice'

function formatPrice(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
}

const MOCK_STATS = [
  { label: 'Total Orders',    value: '12',     icon: '📦', color: 'bg-blue-50 text-blue-700'    },
  { label: 'Total Spent',     value: '$1,240',  icon: '💳', color: 'bg-emerald-50 text-emerald-700' },
  { label: 'Wishlist Items',  value: '5',      icon: '❤️',  color: 'bg-red-50 text-red-700'      },
  { label: 'Reviews Given',   value: '8',      icon: '⭐', color: 'bg-amber-50 text-amber-700'  },
]

const MOCK_RECENT_ORDERS = [
  { id: 'ORD-001', date: '2024-12-01', status: 'Delivered', total: 399  },
  { id: 'ORD-002', date: '2024-11-20', status: 'Shipped',   total: 1799 },
  { id: 'ORD-003', date: '2024-11-05', status: 'Processing',total: 759  },
]

const statusColors: Record<string, string> = {
  Delivered:  'bg-emerald-100 text-emerald-700',
  Shipped:    'bg-blue-100 text-blue-700',
  Processing: 'bg-amber-100 text-amber-700',
  Cancelled:  'bg-red-100 text-red-700',
}

export default function DashboardPage() {
  const { user } = useAuth()
  const cartCount = useAppSelector(selectCartItemCount)
  const cartTotal = useAppSelector(selectCartTotal)

  return (
    <div className="space-y-6">

      {/* Welcome */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">
          Welcome back, {user?.firstName}! 👋
        </h1>
        <p className="text-slate-500">Here's what's happening with your account.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        {MOCK_STATS.map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl border border-slate-100 p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 ${stat.color}`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            <p className="text-sm text-slate-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Cart status */}
      {cartCount > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="font-semibold text-emerald-800">You have {cartCount} item{cartCount > 1 ? 's' : ''} in your cart</p>
            <p className="text-emerald-600 text-sm">Total: {formatPrice(cartTotal)}</p>
          </div>
          <Link href="/checkout"
            className="bg-emerald-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors text-sm">
            Checkout
          </Link>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-800">Recent Orders</h2>
          <Link href="/dashboard/orders" className="text-sm text-emerald-600 font-medium hover:underline">
            View all
          </Link>
        </div>
        <div className="space-y-3">
          {MOCK_RECENT_ORDERS.map(order => (
            <div key={order.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <p className="font-semibold text-slate-800 text-sm">{order.id}</p>
                <p className="text-xs text-slate-400 mt-0.5">{order.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[order.status]}`}>
                  {order.status}
                </span>
                <span className="font-bold text-slate-800 text-sm">{formatPrice(order.total)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}