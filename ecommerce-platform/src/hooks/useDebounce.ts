// src/hooks/useDebounce.ts
// Problem: user types in a search box — we don't want to search on
// EVERY keystroke (that's hundreds of API calls per minute).
// Solution: wait until user STOPS typing for 500ms, THEN search.
//
// Without debounce: "p" → API call, "pr" → API call, "pro" → API call...
// With debounce:    user types "products" → waits 500ms → ONE API call

import { useState, useEffect } from 'react'

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Set a timer to update debouncedValue after `delay` ms
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Cleanup: if value changes BEFORE the timer fires,
    // cancel the old timer and start a new one.
    // This is how debouncing works.
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

// Usage:
// const [search, setSearch] = useState('')
// const debouncedSearch = useDebounce(search, 500)
//
// useEffect(() => {
//   fetchProducts(debouncedSearch)  // only runs 500ms after user stops typing
// }, [debouncedSearch])