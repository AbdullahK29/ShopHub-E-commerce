'use client'

import { useAppSelector } from './useAppSelector'
import { useAppDispatch } from './useAppDispatch'
import { selectUser, selectIsLoggedIn, selectToken, logout } from '@/store/slices/authSlice'
import { clearCart, selectCartItems } from '@/store/slices/cartSlice'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/common/Toast'
import api from '@/services/api'

export function useAuth() {
  const dispatch      = useAppDispatch()
  const router        = useRouter()
  const { showToast } = useToast()

  const user       = useAppSelector(selectUser)
  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  const token      = useAppSelector(selectToken)
  const cartItems  = useAppSelector(selectCartItems)

  // Called after successful login — syncs localStorage cart to backend
  const syncCartToBackend = async () => {
    if (cartItems.length === 0) return
    try {
      await api.post('/cart/sync', {
        items: cartItems.map(item => ({
          productId: item.product.id,
          quantity:  item.quantity,
        }))
      })
    } catch (err) {
      console.error('Cart sync failed:', err)
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    dispatch(clearCart())
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC'
    showToast('Logged out successfully', 'info')
    router.push('/')
  }

  const requireAuth = (callback: () => void) => {
    if (!isLoggedIn) {
      showToast('Please log in to continue', 'warning')
      router.push('/login')
      return
    }
    callback()
  }

  return { user, isLoggedIn, token, handleLogout, requireAuth, syncCartToBackend }
}