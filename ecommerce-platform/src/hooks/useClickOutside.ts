// src/hooks/useClickOutside.ts
// Detects clicks OUTSIDE a referenced element.
// Used for: closing dropdowns, closing modals, closing mobile menus.
//
// Usage:
// const ref = useClickOutside(() => setIsOpen(false))
// <div ref={ref}>...dropdown content...</div>

import { useEffect, useRef } from 'react'

export function useClickOutside<T extends HTMLElement>(
  callback: () => void
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      // If the click is outside the referenced element, run the callback
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback()
      }
    }

    // Listen for clicks on the whole document
    document.addEventListener('mousedown', handleClick)

    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [callback])

  return ref
}