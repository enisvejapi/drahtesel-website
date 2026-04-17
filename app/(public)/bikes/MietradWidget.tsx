'use client'

import { useEffect } from 'react'
import Script from 'next/script'

const MIETRAD_CSS = `
bike-rental-service,
bike-rental-service * {
  font-family: var(--font-outfit), 'Outfit', system-ui, sans-serif !important;
}

/* Shrink the cart bar title and subtitle */
bike-rental-service .sticky-header-bottom-space .text-xl {
  font-size: 0.875rem !important;
  font-weight: 600 !important;
}
bike-rental-service .sticky-header-bottom-space .margin-top {
  font-size: 0.75rem !important;
  margin-top: 2px !important;
}

/* Unfix the top sticky bar */
bike-rental-service .sticky-top {
  position: static !important;
  top: auto !important;
}

/* Fix the cart bar 20% up from the bottom of the viewport */
.sticky-header-bottom-space,
bike-rental-service .sticky-header-bottom-space {
  position: fixed !important;
  bottom: 20% !important;
  top: auto !important;
  transform: none !important;
  left: 0 !important;
  right: 0 !important;
  z-index: 50 !important;
}

bike-rental-service {
    --text-default: #3C3C3C;
    --text-mid: #878787;
    --text-btn: #FFFFFF;
    --text-error: #CC0000;
    --text-success: #70af13;
    --text-warning: #664d03;
    --gray-light: #FDFDFD;
    --gray-mid: #ededed;
    --gray-dark: #C83A2E;
    --secondary-light: #C83A2E;
    --secondary-mid: #000000;
    --secondary-dark: #000000;
    --primary-light: #FF6B6B;
    --primary-mid: #C83A2E;
    --primary-dark: #F19890;
    --orange: #ef931b;
    --bg-default: #FFFFFF;
    --bg-form: #F6F6F6;
    --bg-special: #B4B4B4;
    --bg-error: #f7cdcd;
    --bg-success: #d1e5b1;
    --bg-warning: #fff3cd;
    --border-default: #F6F6F6;
    --border-mid: #F6F6F6;
    --border-warning: #ffecb5;
    --pay-gray: #F1F1F1;
    --pay-gray-border: #F6F6F6;
    --button-border-radius: 0px;
    --bg-basket: #C83A2E;
    --bg-basket-hover: #F19890;
    --datepicker-primary: #C83A2E;
    --datepicker-primary-hover: #F19890;
    --datepicker-inrange-date: #F19890;
    --datepicker-locked-date: #ee9191;
    --datepicker-fg-selected: #FFFFFF;
    --bs-gutter-x: 24px;
    --spacer-0: 0;
    --spacer-1: 4px;
    --spacer-2: 8px;
    --spacer-3: 16px;
    --spacer-4: 24px;
    --spacer-4-plus: 32px;
    --spacer-5: 48px;
    --basket-top-spacer: 24px;
}
`

function resetBar(bar: HTMLElement) {
  // Strip inline styles Mietrad writes — our CSS !important rules take over
  bar.style.removeProperty('top')
  bar.style.removeProperty('position')
  bar.style.removeProperty('bottom')
  bar.style.removeProperty('transform')
  bar.style.removeProperty('left')
  bar.style.removeProperty('right')
}

export default function MietradWidget() {
  useEffect(() => {
    let observer: MutationObserver | null = null

    function applyToAllBars() {
      document.querySelectorAll<HTMLElement>('.sticky-header-bottom-space').forEach(resetBar)
    }

    // Watch the whole document for any attribute change or new node
    // that looks like the Mietrad bar — fires before paint
    observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (
          m.type === 'attributes' &&
          m.attributeName === 'style' &&
          (m.target as HTMLElement).classList?.contains('sticky-header-bottom-space')
        ) {
          resetBar(m.target as HTMLElement)
        }
        if (m.type === 'childList') {
          m.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement) {
              if (node.classList.contains('sticky-header-bottom-space')) resetBar(node)
              node.querySelectorAll<HTMLElement>('.sticky-header-bottom-space').forEach(resetBar)
            }
          })
        }
      }
    })

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style'],
    })

    // Also run immediately in case the bar already exists
    applyToAllBars()

    return () => observer?.disconnect()
  }, [])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: MIETRAD_CSS }} />
      {/* @ts-expect-error — mietrad custom element */}
      <bike-rental-service shop="drahteselnorderney" partner="drahteselney" />
      <Script src="https://www.mietrad.de/js/embed/bike-rental-service.js" strategy="afterInteractive" />
      <Script src="https://www.mietrad.de/js/embed/fallback.js" strategy="afterInteractive" />
    </>
  )
}
