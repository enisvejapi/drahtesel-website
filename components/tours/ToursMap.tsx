'use client'

import { useEffect, useRef } from 'react'
import type { Tour } from '@/lib/tours-data'
import { SHOP_LOCATION, SHOP_ADDRESS, SHOP_HOURS } from '@/lib/tours-data'

interface Props {
  tours: Tour[]
  selectedTourId: string | null
  onTourSelect: (tour: Tour) => void
  locale: 'de' | 'en'
}

export default function ToursMap({ tours, selectedTourId, onTourSelect, locale }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const polylinesRef = useRef<Map<string, any>>(new Map())
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const LRef = useRef<any>(null)
  const de = locale === 'de'

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    // Inject Leaflet CSS once
    if (!document.querySelector('link[href*="leaflet@1.9.4"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    import('leaflet').then((L) => {
      LRef.current = L

      // Fix broken icon paths in Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })

      // Start at a neutral point; fitBounds below will correct it immediately
      const map = L.map(containerRef.current!, {
        center: [53.7080, 7.1500],
        zoom: 13,
        scrollWheelZoom: false,
        zoomControl: true,
      })
      mapRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)

      // ── Shop marker ────────────────────────────────────────────────────────
      // Coordinates verified via Nominatim: Herrenpfad, 26548 Norderney
      // 53.7075312 N, 7.1452623 E
      const shopIcon = L.divIcon({
        className: '',
        html: `
          <div style="
            position:relative;
            width:38px;height:38px;
          ">
            <div style="
              width:38px;height:38px;
              background:#C8102E;
              border-radius:50% 50% 50% 0;
              transform:rotate(-45deg);
              border:3px solid #fff;
              box-shadow:0 3px 10px rgba(0,0,0,0.4);
            "></div>
            <svg style="
              position:absolute;top:6px;left:6px;
              width:18px;height:18px;fill:#fff;
            " viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
            </svg>
          </div>`,
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -40],
      })

      L.marker(SHOP_LOCATION, { icon: shopIcon })
        .addTo(map)
        .bindPopup(
          `<div style="font-family:sans-serif;min-width:160px">` +
          `<strong style="font-size:13px;color:#1A1A1A">Drahtesel Fahrradverleih</strong><br/>` +
          `<span style="font-size:11px;color:#555">${SHOP_ADDRESS}</span><br/>` +
          `<span style="font-size:11px;color:#888">${de ? SHOP_HOURS.de : SHOP_HOURS.en}</span>` +
          `</div>`
        )

      // ── Tour polylines ─────────────────────────────────────────────────────
      const allBounds: [number, number][] = [SHOP_LOCATION]

      tours.forEach((tour) => {
        const isSelected = tour.id === selectedTourId

        const polyline = L.polyline(tour.polyline, {
          color: tour.color,
          weight: isSelected ? 6 : 3.5,
          opacity: isSelected ? 1 : 0.7,
          lineCap: 'round',
          lineJoin: 'round',
        }).addTo(map)

        polyline.on('click', () => onTourSelect(tour))
        polyline.bindTooltip(de ? tour.title.de : tour.title.en, {
          sticky: true,
          direction: 'top',
        })

        // Coloured dot at the start of each route
        const startDot = L.circleMarker(tour.startPoint, {
          radius: 6,
          color: '#fff',
          weight: 2,
          fillColor: tour.color,
          fillOpacity: 1,
        }).addTo(map)
        startDot.on('click', () => onTourSelect(tour))

        polylinesRef.current.set(tour.id, polyline)

        // Collect all coords for fitBounds
        tour.polyline.forEach(pt => allBounds.push(pt))
      })

      // ── Fit the map to show every route + shop ─────────────────────────────
      if (allBounds.length > 1) {
        map.fitBounds(L.latLngBounds(allBounds), { padding: [24, 24] })
      }
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

  // ── Re-style when selection changes ─────────────────────────────────────
  useEffect(() => {
    if (!LRef.current || !mapRef.current) return

    polylinesRef.current.forEach((polyline, id) => {
      const selected = id === selectedTourId
      polyline.setStyle({
        weight:  selected ? 6 : 3.5,
        opacity: selected ? 1 : 0.7,
      })
      if (selected) {
        polyline.bringToFront()
        const tour = tours.find(t => t.id === id)
        if (tour) {
          mapRef.current.flyTo(tour.startPoint, 14, { duration: 0.8 })
        }
      }
    })
  }, [selectedTourId, tours])

  return (
    <div className="relative w-full h-[340px] sm:h-[420px] md:h-[530px] rounded-2xl overflow-hidden shadow-card">
      <div ref={containerRef} className="absolute inset-0" />

      {/* Hint overlay */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[400] pointer-events-none">
        <span className="bg-white/90 backdrop-blur-sm text-[11px] font-medium text-brand-gray px-3 py-1.5 rounded-full shadow-sm whitespace-nowrap">
          {de ? 'Tippe auf eine Route zum Erkunden' : 'Tap a route to explore'}
        </span>
      </div>
    </div>
  )
}
