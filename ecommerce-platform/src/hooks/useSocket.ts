'use client'

import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAppSelector } from './useAppSelector'
import { selectUser } from '@/store/slices/authSlice'
import { useToast } from '@/components/common/Toast'

export function useSocket() {
  const socketRef = useRef<Socket | null>(null)
  const user      = useAppSelector(selectUser)
  const { showToast } = useToast()

  useEffect(() => {
    if (!user) return

    // Connect to backend WebSocket
    const socket = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000')
    socketRef.current = socket

    // Join personal room
    socket.on('connect', () => {
      socket.emit('join', user.id)
    })

    // Listen for order updates
    socket.on('orderCreated', (data: { orderNumber: string; total: number }) => {
      showToast(`Order ${data.orderNumber} confirmed! 🎉`, 'success')
    })

    socket.on('orderStatusUpdate', (data: { orderNumber: string; status: string }) => {
      showToast(`Order ${data.orderNumber} is now ${data.status}`, 'info')
    })

    // Cleanup when user logs out or component unmounts
    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [user, showToast])

  return socketRef.current
}