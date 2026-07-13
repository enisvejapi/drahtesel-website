'use client'

import { useEffect } from 'react'
import Script from 'next/script'

const MIETRAD_CSS = `
bike-rental-service,
bike-rental-service * {
  font-family: var(--font-outfit), 'Outfit', system-ui, sans-serif !important;
}

/* Unfix the top sticky bar */
bike-rental-service .sticky-top {
  position: static !important;
  top: auto !important;
}

/* Hide the floating cart bar */
.sticky-header-bottom-space,
bike-rental-service .sticky-header-bottom-space {
  display: none !important;
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

export default function MietradWidget() {
  useEffect(() => {
    // Inject a style tag dynamically so it's added AFTER Mietrad's own CSS and always wins
    const styleEl = document.createElement('style')
    styleEl.textContent = '.sticky-header-bottom-space { display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; }'
    document.head.appendChild(styleEl)

    function hideAll() {
      // Regular DOM
      document.querySelectorAll<HTMLElement>('.sticky-header-bottom-space').forEach((el) => {
        el.style.setProperty('display', 'none', 'important')
      })
      // Shadow DOM (open shadow roots only)
      document.querySelectorAll('bike-rental-service').forEach((host) => {
        const root = (host as Element & { shadowRoot: ShadowRoot | null }).shadowRoot
        if (root) {
          root.querySelectorAll<HTMLElement>('.sticky-header-bottom-space').forEach((el) => {
            el.style.setProperty('display', 'none', 'important')
          })
          // Inject a style into the shadow root so it persists
          if (!root.querySelector('#drahtesel-hide-bar')) {
            const s = document.createElement('style')
            s.id = 'drahtesel-hide-bar'
            s.textContent = '.sticky-header-bottom-space { display: none !important; visibility: hidden !important; }'
            root.appendChild(s)
          }
        }
      })
    }

    const observer = new MutationObserver(hideAll)
    observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] })

    // Polling as final fallback — runs every 300ms for first 10s then stops
    let ticks = 0
    const interval = setInterval(() => {
      hideAll()
      if (++ticks > 33) clearInterval(interval)
    }, 300)

    hideAll()

    return () => {
      observer.disconnect()
      clearInterval(interval)
      styleEl.remove()
    }
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
