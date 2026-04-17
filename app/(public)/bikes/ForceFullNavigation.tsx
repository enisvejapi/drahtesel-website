'use client'

import { useEffect } from 'react'

/**
 * Mietrad's bike-rental-service.js hijacks history.pushState / replaceState
 * for its own internal booking-flow navigation. This breaks Next.js client-side
 * routing when the user tries to leave /bikes — the URL updates but the page
 * component never unmounts.
 *
 * Fix: intercept every anchor click on this page. If the link points to any
 * internal route that is NOT /bikes, bypass Next.js's router entirely and
 * navigate via window.location.href so the full page load clears Mietrad's state.
 */
export default function ForceFullNavigation() {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const a = (e.target as Element).closest('a[href]') as HTMLAnchorElement | null
      if (!a) return

      const href = a.getAttribute('href') ?? ''

      // Only intercept internal links that leave the bikes section
      if (href.startsWith('/') && !href.startsWith('/bikes')) {
        e.preventDefault()
        e.stopPropagation()
        window.location.href = href
      }
    }

    // Capture phase so we fire before any other click handlers
    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [])

  return null
}
