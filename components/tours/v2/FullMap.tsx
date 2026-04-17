'use client'

import { useEffect, useRef } from 'react'
import type { Tour } from '@/lib/tours-data'
import { SHOP_LOCATION, SHOP_ADDRESS, SHOP_HOURS } from '@/lib/tours-data'
import type { POI } from '@/lib/pois'
import { POI_CATEGORIES } from '@/lib/pois'
import type { StartLocation } from './StartLocationModal'

export type AppMode = 'browse' | 'tour' | 'navigate'

interface Props {
  tours: Tour[]
  selectedTour: Tour | null
  activeStopIdx: number
  mode: AppMode
  pois?: POI[]
  customStart?: StartLocation | null
  onTourClick: (tour: Tour) => void
  onStopClick: (idx: number) => void
  locale: 'de' | 'en'
}

// ─── Helper: stop marker HTML ───────────────────────────────────────────────
function stopIconHtml(num: number, color: string, active: boolean): string {
  if (active) {
    return `
      <div style="position:relative;width:44px;height:44px;display:flex;align-items:center;justify-content:center">
        <div style="position:absolute;inset:0;border-radius:50%;background:${color};opacity:0.25;animation:mapPulse 1.8s ease-in-out infinite"></div>
        <div style="
          position:relative;width:34px;height:34px;
          background:${color};border-radius:50%;
          border:3px solid #fff;
          box-shadow:0 4px 16px rgba(0,0,0,0.35);
          display:flex;align-items:center;justify-content:center;
          color:#fff;font-weight:800;font-size:15px;font-family:system-ui,sans-serif;
        ">${num}</div>
      </div>`
  }
  return `
    <div style="
      width:30px;height:30px;
      background:${color};border-radius:50%;
      border:2.5px solid #fff;
      box-shadow:0 2px 8px rgba(0,0,0,0.25);
      display:flex;align-items:center;justify-content:center;
      color:#fff;font-weight:800;font-size:12px;font-family:system-ui,sans-serif;
    ">${num}</div>`
}

// ─── Helper: shop marker HTML ───────────────────────────────────────────────
const SHOP_ICON_HTML = `
  <div style="position:relative;width:38px;height:38px">
    <div style="
      width:38px;height:38px;
      background:#C8102E;border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      border:3px solid #fff;
      box-shadow:0 3px 10px rgba(0,0,0,0.4);
    "></div>
    <svg style="position:absolute;top:6px;left:6px;width:18px;height:18px;fill:#fff" viewBox="0 0 24 24">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
    </svg>
  </div>`

// ─── Helper: live GPS dot HTML ──────────────────────────────────────────────
const GPS_DOT_HTML = `
  <div style="position:relative;width:28px;height:28px;display:flex;align-items:center;justify-content:center">
    <div style="position:absolute;inset:0;border-radius:50%;background:#4285f4;opacity:0.2;animation:gpsPulse 2s ease-in-out infinite"></div>
    <div style="
      width:16px;height:16px;
      background:#4285f4;border-radius:50%;
      border:3px solid #fff;
      box-shadow:0 2px 10px rgba(66,133,244,0.7);
    "></div>
  </div>`

export default function FullMap({
  tours, selectedTour, activeStopIdx, mode, pois = [], customStart, onTourClick, onStopClick, locale,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const LRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const polylinesRef = useRef<Map<string, any>>(new Map())
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stopMarkersRef = useRef<any[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const poiMarkersRef = useRef<any[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const startDotMarkersRef = useRef<any[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userMarkerRef = useRef<any>(null)
  const watchIdRef = useRef<number | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const customStartMarkerRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const customStartLineRef = useRef<any>(null)
  const de = locale === 'de'

  // ── Init map once ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    if (!document.querySelector('link[href*="leaflet@1.9.4"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    // Inject pulse animation once
    if (!document.querySelector('#map-pulse-style')) {
      const style = document.createElement('style')
      style.id = 'map-pulse-style'
      style.textContent = `
        @keyframes mapPulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.5); opacity: 0.1; }
        }
        @keyframes gpsPulse {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(2.2); opacity: 0.08; }
        }
      `
      document.head.appendChild(style)
    }

    import('leaflet').then((L) => {
      // Guard: component may have unmounted while the import was in flight
      if (!containerRef.current || mapRef.current) return

      LRef.current = L

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })

      const map = L.map(containerRef.current, {
        center: [53.7080, 7.1700],
        zoom: 13,
        scrollWheelZoom: true,
        zoomControl: false,
        attributionControl: true,
      })
      mapRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)

      // Add zoom control top-right
      L.control.zoom({ position: 'topright' }).addTo(map)

      // ── Shop marker ──────────────────────────────────────────────────────
      const shopIcon = L.divIcon({
        className: '',
        html: SHOP_ICON_HTML,
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -40],
      })
      L.marker(SHOP_LOCATION, { icon: shopIcon })
        .addTo(map)
        .bindPopup(
          `<div style="font-family:system-ui,sans-serif;min-width:160px">` +
          `<strong style="font-size:13px;color:#1A1A1A">Drahtesel Fahrradverleih</strong><br/>` +
          `<span style="font-size:11px;color:#555">${SHOP_ADDRESS}</span><br/>` +
          `<span style="font-size:11px;color:#888">${de ? SHOP_HOURS.de : SHOP_HOURS.en}</span>` +
          `</div>`
        )

      // ── Tour polylines (hidden by default, shown only when tour selected) ──
      const allBounds: [number, number][] = [SHOP_LOCATION]

      tours.forEach((tour) => {
        const polyline = L.polyline(tour.polyline, {
          color: tour.color,
          weight: 5,
          opacity: 0,           // hidden in browse mode
          lineCap: 'round',
          lineJoin: 'round',
        }).addTo(map)

        polyline.on('click', () => onTourClick(tour))
        polyline.bindTooltip(de ? tour.title.de : tour.title.en, {
          sticky: true,
          direction: 'top',
          className: 'leaflet-tour-tooltip',
        })

        // ── Start marker — shown in browse mode as tour entry point ─────
        const startIcon = L.divIcon({
          className: '',
          html: `
            <div style="
              position:relative;
              display:flex;flex-direction:column;align-items:center;
              cursor:pointer;
            ">
              <div style="
                width:36px;height:36px;border-radius:50%;
                background:${tour.color};
                border:3px solid #fff;
                box-shadow:0 3px 12px rgba(0,0,0,0.3);
                display:flex;align-items:center;justify-content:center;
              ">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              <div style="
                margin-top:4px;
                background:${tour.color};
                color:#fff;
                font-size:10px;font-weight:800;
                font-family:system-ui,sans-serif;
                padding:2px 7px;border-radius:20px;
                white-space:nowrap;
                box-shadow:0 2px 6px rgba(0,0,0,0.2);
                max-width:120px;overflow:hidden;text-overflow:ellipsis;
              ">${de ? tour.title.de : tour.title.en}</div>
            </div>`,
          iconSize: [36, 60],
          iconAnchor: [18, 18],
          popupAnchor: [0, -22],
        })

        const startMarker = L.marker(tour.startPoint, { icon: startIcon, zIndexOffset: 500 })
          .addTo(map)
          .on('click', () => onTourClick(tour))

        startDotMarkersRef.current.push(startMarker)
        polylinesRef.current.set(tour.id, polyline)
        tour.polyline.forEach(pt => allBounds.push(pt))
      })

      // Fit to all tour start points
      if (allBounds.length > 1) {
        map.fitBounds(L.latLngBounds(allBounds), { padding: [40, 40] })
      }

      // Force Leaflet to re-measure the container after React finishes painting
      // (needed on mobile where the viewport height may shift after hydration)
      setTimeout(() => map.invalidateSize(), 100)
      setTimeout(() => map.invalidateSize(), 500)
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        polylinesRef.current.clear()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Render POI markers ─────────────────────────────────────────────────────
  useEffect(() => {
    const L = LRef.current
    const map = mapRef.current
    if (!L || !map) return

    poiMarkersRef.current.forEach(m => m.remove())
    poiMarkersRef.current = []

    // Show POIs for the selected tour (or all in browse)
    const safePois = Array.isArray(pois) ? pois : []
    const visiblePOIs = selectedTour
      ? safePois.filter(p => p.tourId === selectedTour.id)
      : safePois

    visiblePOIs.forEach(poi => {
      const cat = POI_CATEGORIES[poi.category]
      const icon = L.divIcon({
        html: `<div style="
          width:34px;height:34px;border-radius:50%;
          background:white;border:3px solid ${cat.color};
          box-shadow:0 3px 12px rgba(0,0,0,0.3);
          display:flex;align-items:center;justify-content:center;
          font-size:16px;cursor:pointer;
        ">${cat.emoji}</div>`,
        className: '',
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      })

      const marker = L.marker([poi.lat, poi.lng], { icon, zIndexOffset: 1500 }).addTo(map)
      marker.bindPopup(`
        <div style="font-family:system-ui;min-width:160px;max-width:220px">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
            <span style="font-size:20px">${cat.emoji}</span>
            <strong style="font-size:13px;color:#1A1A1A">${de ? poi.title.de : poi.title.en}</strong>
          </div>
          <div style="font-size:11px;color:${cat.color};font-weight:600;margin-bottom:4px">
            ${de ? cat.label.de : cat.label.en}
          </div>
          ${(de ? poi.description.de : poi.description.en)
            ? `<div style="font-size:12px;color:#555">${de ? poi.description.de : poi.description.en}</div>`
            : ''}
        </div>
      `, { maxWidth: 240 })

      poiMarkersRef.current.push(marker)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pois, selectedTour, de])

  // ── React to selectedTour / mode changes ───────────────────────────────────
  useEffect(() => {
    const L = LRef.current
    const map = mapRef.current
    if (!L || !map) return

    try {
    if (!selectedTour) {
      // Browse mode: hide all polylines, show start markers
      polylinesRef.current.forEach((polyline) => polyline.setStyle({ opacity: 0 }))
      startDotMarkersRef.current.forEach(m => { try { m.setOpacity(1) } catch {} })

      // Clear stop markers
      stopMarkersRef.current.forEach(m => { try { m.remove() } catch {} })
      stopMarkersRef.current = [] as any[]

      // Fit to all start points
      const startCoords = tours.map(t => t.startPoint).filter(Boolean)
      if (startCoords.length > 0) map.fitBounds(L.latLngBounds(startCoords), { padding: [50, 50], maxZoom: 14 })
      return
    }

    // Tour selected: show only this tour's polyline, hide start markers
    polylinesRef.current.forEach((polyline, id) => {
      if (id === selectedTour.id) {
        polyline.setStyle({ weight: 5, opacity: 1 })
        polyline.bringToFront()
      } else {
        polyline.setStyle({ opacity: 0 })
      }
    })
    startDotMarkersRef.current.forEach(m => { try { m.setOpacity(0) } catch {} })

    // Clear old stop markers
    stopMarkersRef.current.forEach(m => { try { m.remove() } catch {} })
    stopMarkersRef.current = [] as any[]

    // Add stop markers for selected tour
    (Array.isArray(selectedTour.stops) ? selectedTour.stops : []).forEach((stop, idx) => {
      const active = idx === activeStopIdx
      const icon = L.divIcon({
        className: '',
        html: stopIconHtml(idx + 1, selectedTour.color, active),
        iconSize: active ? [44, 44] : [30, 30],
        iconAnchor: active ? [22, 22] : [15, 15],
      })
      const marker = L.marker(stop.coords, { icon, zIndexOffset: active ? 1000 : 0 })
        .addTo(map)
        .on('click', () => onStopClick(idx))
      marker.bindTooltip(de ? stop.title.de : stop.title.en, {
        direction: 'top',
        offset: [0, -8],
      })
      stopMarkersRef.current.push(marker)
    })

    // Fit to selected tour
    const polylineCoords = Array.isArray(selectedTour.polyline) ? selectedTour.polyline : []
    if (polylineCoords.length === 0) return
    const bounds = L.latLngBounds(polylineCoords)
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 })
    } catch (err) {
      console.error('[FullMap selectedTour effect]', err)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTour, mode, de])

  // ── Live GPS tracking in navigate mode ────────────────────────────────────
  useEffect(() => {
    const L = LRef.current
    const map = mapRef.current

    if (mode !== 'navigate') {
      // Stop tracking and remove dot when leaving navigate mode
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
        watchIdRef.current = null
      }
      if (userMarkerRef.current) {
        userMarkerRef.current.remove()
        userMarkerRef.current = null
      }
      return
    }

    if (!L || !map || !navigator.geolocation) return

    const gpsIcon = L.divIcon({
      className: '',
      html: GPS_DOT_HTML,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    })

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords
        if (!mapRef.current || !LRef.current) return

        if (!userMarkerRef.current) {
          userMarkerRef.current = LRef.current
            .marker([lat, lng], { icon: gpsIcon, zIndexOffset: 2000 })
            .addTo(mapRef.current)
            .bindTooltip(de ? 'Dein Standort' : 'Your location', {
              direction: 'top', offset: [0, -8], permanent: false,
            })
        } else {
          userMarkerRef.current.setLatLng([lat, lng])
        }

        // Re-center map on user
        mapRef.current.panTo([lat, lng], { animate: true, duration: 0.6 })
      },
      (err) => {
        console.warn('[GPS]', err.message)
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
    )

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
        watchIdRef.current = null
      }
      if (userMarkerRef.current) {
        userMarkerRef.current.remove()
        userMarkerRef.current = null
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  // ── Custom start: extend route polyline from customer's location ───────────
  useEffect(() => {
    const L = LRef.current
    const map = mapRef.current

    // Remove old hotel marker (dashed line no longer used)
    if (customStartMarkerRef.current) { customStartMarkerRef.current.remove(); customStartMarkerRef.current = null }
    if (customStartLineRef.current)   { customStartLineRef.current.remove();   customStartLineRef.current = null }

    // Restore original polyline when customStart is cleared
    if (!customStart || mode !== 'navigate' || !selectedTour) {
      const poly = polylinesRef.current.get(selectedTour?.id ?? '')
      if (poly && selectedTour) poly.setLatLngs(selectedTour.polyline)
      return
    }

    if (!L || !map) return

    // Prepend customer location to the tour's polyline so the route starts from them
    const poly = polylinesRef.current.get(selectedTour.id)
    if (poly) {
      poly.setLatLngs([[customStart.lat, customStart.lng], ...selectedTour.polyline])
    }

    // Hotel / start pin at customer's location
    const startIcon = L.divIcon({
      className: '',
      html: `<div style="
        width:40px;height:40px;border-radius:12px;
        background:#1a1a1a;border:3px solid #fff;
        box-shadow:0 4px 14px rgba(0,0,0,0.45);
        display:flex;align-items:center;justify-content:center;
        font-size:22px;
      ">🏨</div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -24],
    })

    customStartMarkerRef.current = L.marker([customStart.lat, customStart.lng], {
      icon: startIcon,
      zIndexOffset: 1800,
    })
      .addTo(map)
      .bindPopup(
        `<div style="font-family:system-ui;min-width:140px">` +
        `<strong style="font-size:13px">${customStart.label}</strong><br/>` +
        `<span style="font-size:11px;color:#888">${de ? 'Dein Startpunkt' : 'Your starting point'}</span>` +
        `</div>`
      )

    // Fit map to show customer + full tour route
    const allCoords: [number, number][] = [[customStart.lat, customStart.lng], ...selectedTour.polyline]
    map.fitBounds(L.latLngBounds(allCoords), { padding: [50, 50], maxZoom: 15 })

    return () => {
      if (customStartMarkerRef.current) { customStartMarkerRef.current.remove(); customStartMarkerRef.current = null }
      // Restore original polyline on unmount
      const poly = polylinesRef.current.get(selectedTour?.id ?? '')
      if (poly && selectedTour) poly.setLatLngs(selectedTour.polyline)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customStart, mode, selectedTour])

  // ── React to activeStopIdx ─────────────────────────────────────────────────
  useEffect(() => {
    const L = LRef.current
    const map = mapRef.current
    if (!L || !map || !selectedTour) return

    try {
    // Rebuild stop markers to update active state
    stopMarkersRef.current.forEach((marker, idx) => {
      const active = idx === activeStopIdx
      const icon = L.divIcon({
        className: '',
        html: stopIconHtml(idx + 1, selectedTour.color, active),
        iconSize: active ? [44, 44] : [30, 30],
        iconAnchor: active ? [22, 22] : [15, 15],
      })
      marker.setIcon(icon)
      marker.setZIndexOffset(active ? 1000 : 0)
    })

    // Fly to active stop
    const stop = selectedTour.stops[activeStopIdx]
    if (stop) {
      const zoom = mode === 'navigate' ? 17 : 15
      map.flyTo(stop.coords, zoom, { duration: 0.7, easeLinearity: 0.5 })
    }
    } catch (err) {
      console.error('[FullMap activeStopIdx effect]', err)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStopIdx])

  return (
    <>
      <div ref={containerRef} className="absolute inset-0" style={{ background: '#e8eeeb' }} />
      {/* Custom tooltip style */}
      <style>{`
        .leaflet-tour-tooltip {
          background: rgba(26,26,26,0.92) !important;
          color: #fff !important;
          border: none !important;
          border-radius: 8px !important;
          font-size: 12px !important;
          font-weight: 600 !important;
          padding: 5px 10px !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
        }
        .leaflet-tour-tooltip::before {
          border-top-color: rgba(26,26,26,0.92) !important;
        }
        .leaflet-container {
          font-family: system-ui, -apple-system, sans-serif;
        }
        .leaflet-control-attribution {
          font-size: 9px !important;
          opacity: 0.6;
        }
      `}</style>
    </>
  )
}
