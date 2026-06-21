// src/hooks/useLocalStorage.ts
// Works exactly like useState but automatically saves/loads from localStorage.
// Perfect for cart, user preferences, theme — anything that should survive page refresh.
//
// localStorage = browser storage that persists across page refreshes
// It stores STRINGS only — so we JSON.stringify() and JSON.parse()

import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Initialize state from localStorage if value exists, otherwise use initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    // This function runs once on mount — not on every render
    if (typeof window === 'undefined') {
      // window doesn't exist on the server (Next.js SSR)
      // so return initialValue during server-side rendering
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
      // JSON.parse converts the stored string back to the original type
    } catch (error) {
      console.error('Error reading localStorage:', error)
      return initialValue
    }
  })

  // Whenever storedValue changes, save it to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
      // JSON.stringify converts any type (object, array, etc.) to a string
    } catch (error) {
      console.error('Error writing localStorage:', error)
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue] as const
  // 'as const' tells TypeScript this is a tuple [T, Setter<T>]
  // so it has the same shape as useState's return value
}

// Usage:
// const [cart, setCart] = useLocalStorage('cart', [])
// — works exactly like useState but persists across page refreshes