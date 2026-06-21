'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

const SIDEBAR_LINKS = [
  { label: 'Overview',   href: '/dashboard',          icon: '📊' },
  { label: 'My Orders',  href: '/dashboard/orders',   icon: '📦' },
  { label: 'Profile',    href: '/dashboard/profile',  icon: '👤' },
  { label: 'Wishlist',   href: '/dashboard/wishlist', icon: '❤️'  },
  { label: 'Settings',   href: '/dashboard/settings', icon: '⚙️'  },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, handleLogout } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex gap-8">

          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              {/* User info */}
              <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 p-6 text-white">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
                  <span className="font-bold text-lg">
                    {user ? `${user.firstName[0]}${user.lastName[0]}` : '?'}
                  </span>
                </div>
                <p className="font-semibold">{user?.firstName} {user?.lastName}</p>
                <p className="text-emerald-200 text-sm">{user?.email}</p>
              </div>

              {/* Nav */}
              <nav className="p-3">
                {SIDEBAR_LINKS.map(link => (
                  <Link key={link.href} href={link.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors mb-1 ${
                      pathname === link.href
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}>
                    <span>{link.icon}</span>
                    {link.label}
                  </Link>
                ))}
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors mt-2 border-t border-slate-100 pt-3">
                  <span>🚪</span>
                  Sign Out
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  )
}