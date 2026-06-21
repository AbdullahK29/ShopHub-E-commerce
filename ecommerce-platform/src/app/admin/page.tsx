'use client'

import { useState, useEffect } from 'react'
import api from '@/services/api'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

interface Stats {
  totalUsers: number
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  lowStockProducts: number
}

function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: string; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 ${color}`}>
        {icon}
      </div>
      <p className="text-3xl font-bold text-slate-800 mb-1">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  )
}

function formatPrice(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

export default function AdminDashboard() {
  const [stats, setStats]       = useState<Stats | null>(null)
  const [isLoading, setLoading] = useState(true)
  const { user, isLoggedIn }    = useAuth()
  const router                  = useRouter()

  useEffect(() => {
    if (!isLoggedIn || user?.role !== 'ADMIN') {
      router.push('/')
      return
    }

    api.get<{ data: Stats }>('/admin/stats')
      .then(res => setStats(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [isLoggedIn, user, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">ShopHub platform overview</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatCard label="Total Revenue"    value={formatPrice(stats.totalRevenue)}  icon="💰" color="bg-emerald-50" />
          <StatCard label="Total Orders"     value={stats.totalOrders}                icon="📦" color="bg-blue-50"    />
          <StatCard label="Total Users"      value={stats.totalUsers}                 icon="👥" color="bg-purple-50"  />
          <StatCard label="Total Products"   value={stats.totalProducts}              icon="🛍️" color="bg-amber-50"   />
          <StatCard label="Pending Orders"   value={stats.pendingOrders}              icon="⏳" color="bg-orange-50"  />
          <StatCard label="Low Stock Items"  value={stats.lowStockProducts}           icon="⚠️" color="bg-red-50"     />
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Manage Products', href: '/admin/products', icon: '🛍️', desc: 'Add, edit, delete products' },
            { label: 'Manage Orders',   href: '/admin/orders',   icon: '📦', desc: 'Update order statuses'       },
            { label: 'Manage Users',    href: '/admin/users',    icon: '👥', desc: 'View and manage accounts'    },
          ].map(link => (
            <a key={link.href} href={link.href}
              className="bg-white rounded-2xl border border-slate-100 p-6 hover:border-emerald-200 hover:shadow-sm transition-all">
              <span className="text-3xl mb-3 block">{link.icon}</span>
              <p className="font-semibold text-slate-800 mb-1">{link.label}</p>
              <p className="text-sm text-slate-500">{link.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}