'use client'

import Link from 'next/link'
import { useAppSelector } from '@/hooks/useAppSelector'
import { selectIsLoggedIn } from '@/store/slices/authSlice'

export default function HeroCTA() {
  const isLoggedIn = useAppSelector(selectIsLoggedIn)

  return (
    <div className="flex gap-4 justify-center flex-wrap">
      <Link
        href="/products"
        className="bg-white text-emerald-700 font-semibold px-8 py-3 rounded-lg hover:bg-emerald-50 transition-colors"
      >
        Shop Now
      </Link>

      {isLoggedIn ? (
        <Link
          href="/dashboard"
          className="border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/10 transition-colors"
        >
          My Dashboard
        </Link>
      ) : (
        <Link
          href="/register"
          className="border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/10 transition-colors"
        >
          Sign Up Free
        </Link>
      )}
    </div>
  )
}