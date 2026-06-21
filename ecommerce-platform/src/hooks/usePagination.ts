// src/hooks/usePagination.ts
// Handles all pagination logic — current page, total pages,
// which page numbers to show, next/prev buttons.

import { useState, useMemo } from 'react'

interface UsePaginationProps {
  totalItems: number
  itemsPerPage: number
  initialPage?: number
}

export function usePagination({
  totalItems,
  itemsPerPage,
  initialPage = 1,
}: UsePaginationProps) {

  const [currentPage, setCurrentPage] = useState(initialPage)

  // useMemo = only recalculates when dependencies change
  // prevents expensive calculations on every render
  const totalPages = useMemo(
    () => Math.ceil(totalItems / itemsPerPage),
    [totalItems, itemsPerPage]
  )

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex   = Math.min(startIndex + itemsPerPage, totalItems)

  // Which page numbers to show — always show max 5 pages
  // Example: if on page 7 of 20, show [5, 6, 7, 8, 9]
  const pageNumbers = useMemo(() => {
    const pages: (number | '...')[] = []
    const delta = 2  // how many pages around current to show

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i)
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...')
      }
    }

    return pages
  }, [currentPage, totalPages])

  const goToPage    = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  const nextPage    = () => goToPage(currentPage + 1)
  const prevPage    = () => goToPage(currentPage - 1)
  const canGoNext   = currentPage < totalPages
  const canGoPrev   = currentPage > 1

  return {
    currentPage,
    totalPages,
    pageNumbers,
    startIndex,
    endIndex,
    goToPage,
    nextPage,
    prevPage,
    canGoNext,
    canGoPrev,
  }
}