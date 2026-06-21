'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useAppSelector } from '@/hooks/useAppSelector'
import { selectCartItemCount } from '@/store/slices/cartSlice'
import { useClickOutside } from '@/hooks/useClickOutside'

const NAV_LINKS = [
  { label: 'Home',     href: '/'         },
  { label: 'Products', href: '/products' },
  { label: 'Deals',    href: '/deals'    },
  { label: 'About',    href: '/about'    },
]

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen,   setIsUserMenuOpen]   = useState(false)
  const [searchQuery, setSearchQuery]           = useState('')

  const { user, isLoggedIn, handleLogout } = useAuth()
  const cartItemCount = useAppSelector(selectCartItemCount)

  // Close user dropdown when clicking outside
  const userMenuRef = useClickOutside<HTMLDivElement>(() => setIsUserMenuOpen(false))

  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : ''

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-slate-800 text-lg hidden sm:block">ShopHub</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <Link key={link.href} href={link.href}
                className="px-3 py-2 text-sm font-medium text-slate-600 rounded-lg hover:text-emerald-600 hover:bg-emerald-50 transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-xs">
            <div className="relative w-full">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="search" placeholder="Search products..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">

            {/* Cart */}
            <Link href="/cart"
              className="relative p-2 rounded-lg text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
              aria-label="Cart">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </span>
              )}
            </Link>

            {/* Auth — logged in vs logged out */}
            {isLoggedIn && user ? (
              // User dropdown
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{initials}</span>
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-slate-700">
                    {user.firstName}
                  </span>
                  <svg className="w-3 h-3 text-slate-400 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-sm font-semibold text-slate-800">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
                    </div>
                    {[
                      { label: 'Dashboard',   href: '/dashboard'         },
                      { label: 'My Orders',   href: '/dashboard/orders'  },
                      { label: 'Profile',     href: '/dashboard/profile' },
                      { label: 'Wishlist',    href: '/dashboard/wishlist'},
                    ].map(item => (
                      <Link key={item.href} href={item.href}
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-emerald-600 transition-colors">
                        {item.label}
                      </Link>
                    ))}
                    <div className="border-t border-slate-100 mt-2 pt-2">
                      <button onClick={() => { handleLogout(); setIsUserMenuOpen(false) }}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/login"
                  className="text-sm font-medium text-slate-600 hover:text-emerald-600 px-3 py-2 rounded-lg hover:bg-emerald-50 transition-colors">
                  Login
                </Link>
                <Link href="/register"
                  className="text-sm font-semibold bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 py-4 space-y-1">
            <div className="relative mb-3">
              <input type="search" placeholder="Search products..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            {NAV_LINKS.map(link => (
              <Link key={link.href} href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-slate-600 rounded-lg hover:bg-emerald-50 hover:text-emerald-600">
                {link.label}
              </Link>
            ))}
            {!isLoggedIn && (
              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <Link href="/login" className="flex-1 text-center text-sm font-medium border border-slate-300 text-slate-600 px-4 py-2.5 rounded-lg">Login</Link>
                <Link href="/register" className="flex-1 text-center text-sm font-semibold bg-emerald-600 text-white px-4 py-2.5 rounded-lg">Sign Up</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}