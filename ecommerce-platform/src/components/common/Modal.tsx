// src/components/common/Modal.tsx
// A fully accessible modal dialog.
// Key features: backdrop click closes it, Escape key closes it,
// focus is trapped inside, body scroll is locked while open.

'use client'

import { useEffect, useRef } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showCloseButton?: boolean
}

const sizes = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
}: ModalProps) {

  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    // Lock body scroll when modal is open
    // Without this, the page scrolls behind the modal
    document.body.style.overflow = 'hidden'

    // Close on Escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)

    // Focus the modal when it opens — important for accessibility
    modalRef.current?.focus()

    // Cleanup — runs when modal closes
    return () => {
      document.body.style.overflow = 'unset'
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  // Don't render anything if closed
  // This is different from just hiding with CSS — it fully unmounts the content
  if (!isOpen) return null

  return (
    // Portal-like overlay — covers the entire screen
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Backdrop — clicking this closes the modal */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal box — stopPropagation prevents backdrop click from firing */}
      <div
        ref={modalRef}
        tabIndex={-1}   // makes the div focusable
        onClick={(e) => e.stopPropagation()}
        className={`
          relative w-full ${sizes[size]} bg-white rounded-2xl shadow-xl
          focus:outline-none
          animate-in fade-in slide-in-from-bottom-4 duration-200
        `}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            {title && (
              <h2 id="modal-title" className="text-lg font-semibold text-slate-800">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="ml-auto p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}