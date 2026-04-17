'use client'

import { useEffect, useRef, useState } from 'react'
import type { InterestPin } from '@/lib/interest-pins'
import { PIN_CATEGORIES } from '@/lib/interest-pins'
import type { StartLocation } from '@/components/tours/v2/StartLocationModal'
import { SHOP_LOCATION, SHOP_ADDRESS } from '@/lib/tours-data'

// Synthetic pin for the shop — lets it flow through the existing routing system
const SHOP_PIN: InterestPin = {
  id: 'shop',
  title: { de: 'Drahtesel Fahrradverleih', en: 'Drahtesel Bike Rental' },
  description: {
    de: 'Fahrrad-Rückgabe & Verleih. Bringe dein Fahrrad einfach hierher zurück.',
    en: 'Bike return & rental. Simply bring your bike back here.',
  },
  tip: {
    de: 'Tap auf "Route hierher" um eine Radroute zum Shop zu berechnen.',
    en: 'Tap "Route here" to get a cycling route back to the shop.',
  },
  category: 'landmark',
  lat: SHOP_LOCATION[0],
  lng: SHOP_LOCATION[1],
}

export interface RouteStep {
  type: string        // depart | arrive | turn | fork | roundabout…
  modifier: string    // left | right | straight | slight left…
  distance: number    // meters to next maneuver
  duration: number    // seconds
  name: string        // road name
  maneuverLocation: [number, number]  // [lat, lng]
}

export interface ActiveRoute {
  coords: [number, number][]
  distance: number   // meters
  duration: number   // seconds
  steps: RouteStep[]
}

interface Props {
  startLocation: StartLocation | null
  pins: InterestPin[]
  selectedPin: InterestPin | null
  activeRoute: ActiveRoute | null
  navigating: boolean
  locale: 'de' | 'en'
  onPinSelect: (pin: InterestPin) => void
  onPositionUpdate?: (lat: number, lng: number, heading: number) => void
  // Route planner
  planningMode?: boolean
  plannerStart?: [number, number] | null
  plannerEnd?: [number, number] | null
  onMapClick?: (lat: number, lng: number) => void
}

// ── Haversine distance (meters) ──────────────────────────────────────────────
function haversine(a: [number, number], b: [number, number]): number {
  const R = 6371000
  const lat1 = (a[0] * Math.PI) / 180
  const lat2 = (b[0] * Math.PI) / 180
  const dLat = ((b[0] - a[0]) * Math.PI) / 180
  const dLon = ((b[1] - a[1]) * Math.PI) / 180
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s))
}

// ── Bearing between two points ───────────────────────────────────────────────
function calcBearing(from: [number, number], to: [number, number]): number {
  const [lat1, lon1] = from.map(d => (d * Math.PI) / 180)
  const [lat2, lon2] = to.map(d => (d * Math.PI) / 180)
  const dLon = lon2 - lon1
  const y = Math.sin(dLon) * Math.cos(lat2)
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon)
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360
}

export default function ExploreMap({
  startLocation, pins, selectedPin, activeRoute, navigating, locale, onPinSelect, onPositionUpdate,
  planningMode, plannerStart, plannerEnd, onMapClick,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const LRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pinMarkersRef = useRef<any[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const startMarkerRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const routePolylineRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userDotRef = useRef<any>(null)
  const watchIdRef = useRef<number | null>(null)
  const lastPosRef = useRef<[number, number] | null>(null)
  const renderedPosRef = useRef<[number, number] | null>(null)  // last position actually drawn
  const headingRef = useRef<number>(0)
  const smoothedHeadingRef = useRef<number>(0)  // EMA-smoothed heading
  const compassHeadingRef = useRef<number | null>(null)
  const lastOrientationRef = useRef<number>(0)  // throttle compass DOM updates
  const navigatingRef = useRef(navigating)
  const firstNavFixRef = useRef(false)
  const navStartTimeRef = useRef<number>(0)
  const activeRouteRef = useRef(activeRoute)
  const [mapReady, setMapReady] = useState(false)
  const planningModeRef = useRef(false)
  const onMapClickRef = useRef(onMapClick)
  const onPositionUpdateRef = useRef(onPositionUpdate)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const plannerMarkersRef = useRef<any[]>([])
  const de = locale === 'de'

  // Keep activeRouteRef in sync
  useEffect(() => { activeRouteRef.current = activeRoute }, [activeRoute])

  // Keep navigatingRef in sync; on navigation start → brief route overview + reset first-fix
  useEffect(() => {
    navigatingRef.current = navigating
    if (!navigating) return

    firstNavFixRef.current = false
    navStartTimeRef.current = Date.now()

    // Briefly show the full route before flying to user position
    const map = mapRef.current
    const L = LRef.current
    const route = activeRouteRef.current
    if (!map || !L || !route || route.coords.length < 2) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(map as any).flyToBounds(L.latLngBounds(route.coords), {
      padding: [80, 80],
      maxZoom: 14,
      animate: true,
      duration: 0.9,
    })
  }, [navigating])

  // Keep planningMode ref in sync
  useEffect(() => { planningModeRef.current = !!planningMode }, [planningMode])
  useEffect(() => { onMapClickRef.current = onMapClick }, [onMapClick])
  useEffect(() => { onPositionUpdateRef.current = onPositionUpdate }, [onPositionUpdate])

  // ── Init map ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    if (!document.querySelector('link[href*="leaflet@1.9.4"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    if (!document.querySelector('#explore-pulse-style')) {
      const style = document.createElement('style')
      style.id = 'explore-pulse-style'
      style.textContent = `
        @keyframes gpsPulse {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(2.4); opacity: 0.06; }
        }
        @keyframes pinDrop {
          0%   { transform: translateY(-20px) scale(0.85); opacity: 0; }
          60%  { transform: translateY(4px)   scale(1.05); opacity: 1; }
          100% { transform: translateY(0)     scale(1);    opacity: 1; }
        }
        @keyframes pinPulseRing {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes navRingExpand {
          0%   { transform: scale(0.6); opacity: 0.8; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes navSpin {
          to { transform: rotate(360deg); }
        }
      `
      document.head.appendChild(style)
    }

    import('leaflet').then((L) => {
      if (!containerRef.current || mapRef.current) return
      LRef.current = L

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl

      const map = L.map(containerRef.current, {
        center: [53.7080, 7.1900],
        zoom: 13,
        minZoom: 12,
        scrollWheelZoom: true,
        zoomControl: false,
        touchZoom: true,
        attributionControl: true,
      })
      mapRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)

      // Shop marker — interactive, routes back to shop like a pin
      const shopIcon = L.divIcon({
        className: '',
        html: `
          <div style="
            display:flex;flex-direction:column;align-items:center;
            animation:pinDrop 0.35s cubic-bezier(0.34,1.56,0.64,1) both;
            cursor:pointer;
          ">
            <div style="
              position:relative;
              width:48px;height:62px;
              filter:drop-shadow(0 4px 12px rgba(200,16,46,0.45));
            ">
              <svg viewBox="0 0 52 66" width="48" height="62" fill="none">
                <path d="M26 2C15.51 2 7 10.51 7 21c0 12.88 19 43 19 43S45 33.88 45 21C45 10.51 36.49 2 26 2z" fill="#C8102E"/>
                <circle cx="26" cy="21" r="14" fill="white"/>
              </svg>
              <div style="
                position:absolute;
                top:4px;
                left:50%;
                transform:translateX(-50%);
                display:flex;align-items:center;justify-content:center;
              ">
                <svg viewBox="0 0 24 24" width="18" height="18"
                  fill="none" stroke="#C8102E" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                  <circle cx="12" cy="9" r="2.5"/>
                </svg>
              </div>
            </div>
            <div style="
              margin-top:4px;
              background:white;
              color:#C8102E;
              font-size:10px;font-weight:800;font-family:system-ui,sans-serif;
              padding:3px 8px;border-radius:20px;white-space:nowrap;
              box-shadow:0 2px 8px rgba(0,0,0,0.15);
              border:1.5px solid #C8102E30;
            ">Drahtesel</div>
          </div>`,
        iconSize: [48, 90],
        iconAnchor: [24, 62],
        popupAnchor: [0, -70],
      })
      L.marker(SHOP_LOCATION, { icon: shopIcon, zIndexOffset: 100 })
        .addTo(map)
        .on('click', () => onPinSelect(SHOP_PIN))

      // Map click — used for route planner mode
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      map.on('click', (e: any) => {
        if (planningModeRef.current) {
          onMapClickRef.current?.(e.latlng.lat, e.latlng.lng)
        }
      })

      setTimeout(() => map.invalidateSize(), 100)
      setTimeout(() => map.invalidateSize(), 500)

      // Signal that the map + Leaflet are ready — triggers pin rendering
      setMapReady(true)
    })

    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current)
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Render pins ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const L = LRef.current
    const map = mapRef.current
    if (!L || !map) return

    pinMarkersRef.current.forEach(m => { try { m.remove() } catch {} })
    pinMarkersRef.current = []

    // SVG icon paths per category (Lucide-style, stroke-only, viewBox 0 0 24 24)
    const CATEGORY_ICON: Record<string, string> = {
      history:   `<path d="M3 21h18M5 21V9l7-5 7 5v12M10 21v-5h4v5"/>`,
      beach:     `<path d="M2 10.5c2.5-3 6-3 9-.5s6.5 2.5 9-.5M2 16.5c2.5-3 6-3 9-.5s6.5 2.5 9-.5"/>`,
      nature:    `<path d="M12 22v-9M12 13C9 10 5 9 3 11c2 0 5 2 9 2zM12 13c3-3 7-4 9-2-2 0-5 2-9 2"/>`,
      food:      `<path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>`,
      viewpoint: `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`,
      landmark:  `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>`,
    }

    pins.forEach(pin => {
      const cat = PIN_CATEGORIES[pin.category]
      const isSelected = selectedPin?.id === pin.id
      const iconPath = CATEGORY_ICON[pin.category] ?? CATEGORY_ICON.landmark
      const sz = isSelected ? 52 : 40
      const innerR = isSelected ? 16 : 12

      const html = `
        <div style="
          display:flex;flex-direction:column;align-items:center;
          animation:pinDrop 0.35s cubic-bezier(0.34,1.56,0.64,1) both;
          cursor:pointer;
        ">
          ${isSelected ? `
            <div style="
              position:absolute;
              width:${sz}px;height:${sz}px;
              border-radius:50%;
              background:${cat.color};
              animation:pinPulseRing 1.4s ease-out infinite;
            "></div>` : ''}
          <div style="
            position:relative;
            width:${sz}px;height:${Math.round(sz * 1.28)}px;
            filter:drop-shadow(0 ${isSelected ? 6 : 3}px ${isSelected ? 14 : 8}px rgba(0,0,0,${isSelected ? 0.45 : 0.28}));
          ">
            <svg viewBox="0 0 52 66" width="${sz}" height="${Math.round(sz * 1.28)}" fill="none">
              <path d="M26 2C15.51 2 7 10.51 7 21c0 12.88 19 43 19 43S45 33.88 45 21C45 10.51 36.49 2 26 2z" fill="${cat.color}"/>
              <circle cx="26" cy="21" r="${innerR}" fill="white"/>
            </svg>
            <div style="
              position:absolute;
              top:${isSelected ? 5 : 4}px;
              left:50%;
              transform:translateX(-50%);
              display:flex;align-items:center;justify-content:center;
            ">
              <svg viewBox="0 0 24 24" width="${isSelected ? 20 : 15}" height="${isSelected ? 20 : 15}"
                fill="none" stroke="${cat.color}" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                ${iconPath}
              </svg>
            </div>
          </div>
          ${isSelected ? `
            <div style="
              margin-top:5px;
              background:white;
              color:${cat.color};
              font-size:11px;font-weight:800;font-family:system-ui,sans-serif;
              padding:3px 10px;border-radius:20px;white-space:nowrap;
              box-shadow:0 3px 10px rgba(0,0,0,0.18);
              border:1.5px solid ${cat.color}30;
            ">${de ? pin.title.de : pin.title.en}</div>` : ''}
        </div>`

      const icon = L.divIcon({
        className: '',
        html,
        iconSize: isSelected ? [sz, Math.round(sz * 1.28) + 28] : [sz, Math.round(sz * 1.28)],
        iconAnchor: [sz / 2, Math.round(sz * 1.28)],
      })

      const marker = L.marker([pin.lat, pin.lng], {
        icon,
        zIndexOffset: isSelected ? 1000 : 500,
      })
        .addTo(map)
        .on('click', () => onPinSelect(pin))

      pinMarkersRef.current.push(marker)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pins, selectedPin, de, mapReady])

  // ── Start location marker ───────────────────────────────────────────────────
  useEffect(() => {
    const L = LRef.current
    const map = mapRef.current
    if (!L || !map) return

    if (startMarkerRef.current) { startMarkerRef.current.remove(); startMarkerRef.current = null }
    if (!startLocation) return

    const icon = L.divIcon({
      className: '',
      html: `<div style="
        width:42px;height:42px;border-radius:12px;
        background:#1a1a1a;border:3px solid #fff;
        box-shadow:0 4px 16px rgba(0,0,0,0.5);
        display:flex;align-items:center;justify-content:center;
        font-size:22px;
      ">🏨</div>`,
      iconSize: [42, 42],
      iconAnchor: [21, 21],
      popupAnchor: [0, -26],
    })

    startMarkerRef.current = L.marker([startLocation.lat, startLocation.lng], {
      icon, zIndexOffset: 2000,
    })
      .addTo(map)
      .bindPopup(
        `<div style="font-family:system-ui;min-width:140px">` +
        `<strong style="font-size:13px">${startLocation.label}</strong><br/>` +
        `<span style="font-size:11px;color:#888">${de ? 'Dein Startpunkt' : 'Your start'}</span>` +
        `</div>`
      )

    // Fit map to show start + all pins
    const allCoords: [number, number][] = [
      [startLocation.lat, startLocation.lng],
      ...pins.map(p => [p.lat, p.lng] as [number, number]),
    ]
    if (allCoords.length > 1) {
      map.fitBounds(L.latLngBounds(allCoords), { padding: [50, 50], maxZoom: 14 })
    } else {
      map.setView([startLocation.lat, startLocation.lng], 14)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startLocation, de, mapReady])

  // ── Planner markers (A / B) ───────────────────────────────────────────────────
  useEffect(() => {
    const L = LRef.current
    const map = mapRef.current
    if (!L || !map) return

    plannerMarkersRef.current.forEach(m => { try { m.remove() } catch {} })
    plannerMarkersRef.current = []

    const makeLabel = (letter: string, color: string, coords: [number, number]) => {
      const icon = L.divIcon({
        className: '',
        html: `
          <div style="display:flex;flex-direction:column;align-items:center;animation:pinDrop 0.3s cubic-bezier(0.34,1.56,0.64,1) both;">
            <div style="position:relative;width:44px;height:56px;filter:drop-shadow(0 4px 10px rgba(0,0,0,0.35));">
              <svg viewBox="0 0 52 66" width="44" height="56" fill="none">
                <path d="M26 2C15.51 2 7 10.51 7 21c0 12.88 19 43 19 43S45 33.88 45 21C45 10.51 36.49 2 26 2z" fill="${color}"/>
                <circle cx="26" cy="21" r="14" fill="white"/>
              </svg>
              <div style="position:absolute;top:3px;left:50%;transform:translateX(-50%);font-size:18px;font-weight:900;color:${color};font-family:system-ui,sans-serif;">${letter}</div>
            </div>
          </div>`,
        iconSize: [44, 56],
        iconAnchor: [22, 56],
      })
      return L.marker(coords, { icon, zIndexOffset: 900 }).addTo(map)
    }

    if (plannerStart) plannerMarkersRef.current.push(makeLabel('A', '#16a34a', plannerStart))
    if (plannerEnd)   plannerMarkersRef.current.push(makeLabel('B', '#C8102E', plannerEnd))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plannerStart, plannerEnd, mapReady])

  // ── Active route ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const L = LRef.current
    const map = mapRef.current
    if (!L || !map) return

    if (routePolylineRef.current) { routePolylineRef.current.remove(); routePolylineRef.current = null }
    if (!activeRoute) return

    const color = selectedPin ? PIN_CATEGORIES[selectedPin.category].color : '#C8102E'
    routePolylineRef.current = L.polyline(activeRoute.coords, {
      color,
      weight: 5,
      opacity: 0.9,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(map)

    // Zoom to show the full route
    if (!navigating) {
      map.fitBounds(routePolylineRef.current.getBounds(), { padding: [80, 80], maxZoom: 16 })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRoute, selectedPin, mapReady])

  // ── Live GPS + Compass — dot when browsing, rotating arrow when navigating ───
  useEffect(() => {
    if (!navigator.geolocation) return

    function makeNavIcon(heading: number) {
      const L = LRef.current
      if (!L) return null
      return L.divIcon({
        className: '',
        html: `
          <div style="position:relative;width:52px;height:52px;display:flex;align-items:center;justify-content:center">
            <div style="position:absolute;inset:0;border-radius:50%;background:#4285f4;opacity:0.15;animation:gpsPulse 2s ease-in-out infinite"></div>
            <div data-nav-arrow style="
              width:36px;height:36px;
              transform:rotate(${heading}deg);
              transition:transform 0.25s linear;
              filter:drop-shadow(0 2px 8px rgba(66,133,244,0.8));
              display:flex;align-items:center;justify-content:center;
            ">
              <svg viewBox="0 0 24 24" fill="#4285f4" width="36" height="36">
                <path d="M12 2L5 21l7-4 7 4L12 2z"/>
                <path d="M12 5.5l4 11-4-2.3-4 2.3 4-11z" fill="white" opacity="0.6"/>
              </svg>
            </div>
          </div>`,
        iconSize: [52, 52],
        iconAnchor: [26, 26],
      })
    }

    function makeDotIcon() {
      const L = LRef.current
      if (!L) return null
      return L.divIcon({
        className: '',
        html: `<div style="position:relative;width:26px;height:26px;display:flex;align-items:center;justify-content:center">
          <div style="position:absolute;inset:0;border-radius:50%;background:#4285f4;opacity:0.2;animation:gpsPulse 2s ease-in-out infinite"></div>
          <div style="width:14px;height:14px;background:#4285f4;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 8px rgba(66,133,244,0.6)"></div>
        </div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      })
    }

    // Update the arrow rotation directly in DOM (smooth, no icon recreation)
    function updateArrowDOM(heading: number) {
      if (!userDotRef.current) return
      const el = userDotRef.current.getElement?.()
      if (!el) return
      const arrow = el.querySelector('[data-nav-arrow]') as HTMLElement | null
      if (arrow) arrow.style.transform = `rotate(${heading}deg)`
    }

    // ── Smooth angle helper (handles 0/360 wrap-around) ─────────────────────
    function smoothAngle(prev: number, next: number, alpha: number): number {
      const diff = ((next - prev + 540) % 360) - 180
      return (prev + alpha * diff + 360) % 360
    }

    // ── Device compass ────────────────────────────────────────────────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function handleOrientation(e: any) {
      let h: number | null = null
      if (e.webkitCompassHeading !== undefined && e.webkitCompassHeading !== null && !isNaN(e.webkitCompassHeading)) {
        h = e.webkitCompassHeading
      } else if (e.absolute && e.alpha !== null && !isNaN(e.alpha)) {
        h = (360 - e.alpha) % 360
      } else if (e.alpha !== null && !isNaN(e.alpha)) {
        h = (360 - e.alpha) % 360
      }
      if (h === null) return

      // Smooth the heading with EMA (alpha=0.15 = slow, smooth rotation)
      smoothedHeadingRef.current = smoothAngle(smoothedHeadingRef.current, h, 0.15)
      compassHeadingRef.current = smoothedHeadingRef.current
      headingRef.current = smoothedHeadingRef.current

      // Throttle DOM updates to max ~10/sec so it doesn't flicker
      const now = Date.now()
      if (now - lastOrientationRef.current < 100) return
      lastOrientationRef.current = now

      if (navigatingRef.current) updateArrowDOM(smoothedHeadingRef.current)
    }

    window.addEventListener('deviceorientationabsolute', handleOrientation, true)
    window.addEventListener('deviceorientation', handleOrientation, true)

    // ── GPS position tracking ─────────────────────────────────────────────────
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }

    let prevWasNav = navigatingRef.current

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords
        if (!mapRef.current || !LRef.current) return

        const isNav = navigatingRef.current

        // Heading priority: compass > GPS heading > calculated bearing
        let heading = headingRef.current
        if (compassHeadingRef.current !== null) {
          heading = compassHeadingRef.current
        } else if (pos.coords.heading !== null && !isNaN(pos.coords.heading)) {
          heading = pos.coords.heading
          headingRef.current = heading
        } else if (lastPosRef.current) {
          const d = haversine(lastPosRef.current, [lat, lng])
          if (d > 1) {
            heading = calcBearing(lastPosRef.current, [lat, lng])
            headingRef.current = heading
          }
        }
        lastPosRef.current = [lat, lng]

        // Only move the dot if user has actually moved 8m+ (kills GPS jitter)
        const distFromRendered = renderedPosRef.current
          ? haversine(renderedPosRef.current, [lat, lng])
          : Infinity
        const shouldMove = distFromRendered > 3

        if (!userDotRef.current) {
          // First fix — create the marker
          const icon = isNav ? makeNavIcon(heading) : makeDotIcon()
          if (!icon) return
          userDotRef.current = LRef.current
            .marker([lat, lng], { icon, zIndexOffset: 3000 })
            .addTo(mapRef.current)
          renderedPosRef.current = [lat, lng]
          prevWasNav = isNav
        } else {
          // Move the marker only when displacement is real
          if (shouldMove) {
            userDotRef.current.setLatLng([lat, lng])
            renderedPosRef.current = [lat, lng]
          }

          // If mode changed (nav ↔ browse), swap the icon
          if (prevWasNav !== isNav) {
            const icon = isNav ? makeNavIcon(heading) : makeDotIcon()
            if (icon) userDotRef.current.setIcon(icon)
            prevWasNav = isNav
          } else if (isNav && compassHeadingRef.current === null) {
            // No compass — update arrow from GPS bearing
            updateArrowDOM(heading)
          }
        }

        // Keep map centered on user when navigating
        if (isNav) {
          if (!firstNavFixRef.current) {
            firstNavFixRef.current = true
            // Wait for the route-overview animation to finish, then fly to user
            const elapsed = Date.now() - navStartTimeRef.current
            const delay = Math.max(0, 1050 - elapsed)
            const capLat = lat, capLng = lng
            setTimeout(() => {
              if (!mapRef.current) return
              mapRef.current.flyTo([capLat, capLng], 17, {
                animate: true,
                duration: 2.0,
                easeLinearity: 0.15,
              })
            }, delay)
          } else {
            mapRef.current.panTo([lat, lng], { animate: true, duration: 0.5 })
          }
        }

        onPositionUpdateRef.current?.(lat, lng, heading)
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 15000 }
    )

    return () => {
      window.removeEventListener('deviceorientationabsolute', handleOrientation, true)
      window.removeEventListener('deviceorientation', handleOrientation, true)
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
        watchIdRef.current = null
      }
      if (userDotRef.current) { userDotRef.current.remove(); userDotRef.current = null }
      renderedPosRef.current = null
      compassHeadingRef.current = null
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigating])

  return (
    <>
      <div ref={containerRef} className="absolute inset-0" style={{ background: '#e8eeeb' }} />
      <style>{`
        .leaflet-container { font-family: system-ui, -apple-system, sans-serif; }
        .leaflet-control-attribution { font-size: 9px !important; opacity: 0.5; }
        ${planningMode ? '.leaflet-container { cursor: crosshair !important; }' : ''}
      `}</style>
    </>
  )
}
