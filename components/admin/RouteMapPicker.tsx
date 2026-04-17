'use client'

import { useEffect, useRef, useState } from 'react'
import { MapPin, RotateCcw } from 'lucide-react'

interface Props {
  startLat: string
  startLng: string
  endLat: string
  endLng: string
  onChange: (field: 'startLat' | 'startLng' | 'endLat' | 'endLng', value: string) => void
}

export default function RouteMapPicker({ startLat, startLng, endLat, endLng, onChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const LRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerARef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerBRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const polylineRef = useRef<any>(null)
  const [step, setStep] = useState<'A' | 'B' | 'done'>('A')
  const stepRef = useRef<'A' | 'B' | 'done'>('A')

  // Keep stepRef in sync
  useEffect(() => { stepRef.current = step }, [step])

  // Init map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    if (!document.querySelector('link[href*="leaflet@1.9.4"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    import('leaflet').then(L => {
      if (!containerRef.current || mapRef.current) return
      LRef.current = L

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl

      const map = L.map(containerRef.current, {
        center: [53.7075, 7.1680],
        zoom: 13,
        zoomControl: true,
        scrollWheelZoom: true,
      })
      mapRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 19,
      }).addTo(map)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      map.on('click', (e: any) => {
        const { lat, lng } = e.latlng
        const current = stepRef.current

        if (current === 'A') {
          placeMarker('A', lat, lng)
          onChange('startLat', lat.toFixed(6))
          onChange('startLng', lng.toFixed(6))
          stepRef.current = 'B'
          setStep('B')
        } else if (current === 'B') {
          placeMarker('B', lat, lng)
          onChange('endLat', lat.toFixed(6))
          onChange('endLng', lng.toFixed(6))
          stepRef.current = 'done'
          setStep('done')
        }
      })

      setTimeout(() => map.invalidateSize(), 100)

      // If coords already set (edit mode), place markers
      if (startLat && startLng) {
        placeMarker('A', parseFloat(startLat), parseFloat(startLng))
        if (endLat && endLng) {
          placeMarker('B', parseFloat(endLat), parseFloat(endLng))
          stepRef.current = 'done'
          setStep('done')
        } else {
          stepRef.current = 'B'
          setStep('B')
        }
      }
    })

    return () => {
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function placeMarker(which: 'A' | 'B', lat: number, lng: number) {
    const L = LRef.current
    const map = mapRef.current
    if (!L || !map) return

    const color = which === 'A' ? '#16a34a' : '#C8102E'
    const icon = L.divIcon({
      className: '',
      html: `
        <div style="display:flex;flex-direction:column;align-items:center;">
          <div style="position:relative;width:36px;height:46px;filter:drop-shadow(0 3px 8px rgba(0,0,0,0.3));">
            <svg viewBox="0 0 52 66" width="36" height="46" fill="none">
              <path d="M26 2C15.51 2 7 10.51 7 21c0 12.88 19 43 19 43S45 33.88 45 21C45 10.51 36.49 2 26 2z" fill="${color}"/>
              <circle cx="26" cy="21" r="13" fill="white"/>
            </svg>
            <div style="position:absolute;top:3px;left:50%;transform:translateX(-50%);font-size:15px;font-weight:900;color:${color};font-family:system-ui,sans-serif;">${which}</div>
          </div>
        </div>`,
      iconSize: [36, 46],
      iconAnchor: [18, 46],
    })

    if (which === 'A') {
      if (markerARef.current) markerARef.current.remove()
      markerARef.current = L.marker([lat, lng], { icon }).addTo(map)
    } else {
      if (markerBRef.current) markerBRef.current.remove()
      markerBRef.current = L.marker([lat, lng], { icon }).addTo(map)
    }

    // Draw line between A and B if both exist
    if (polylineRef.current) { polylineRef.current.remove(); polylineRef.current = null }
    const aPos = which === 'A'
      ? [lat, lng]
      : markerARef.current?.getLatLng() ? [markerARef.current.getLatLng().lat, markerARef.current.getLatLng().lng] : null
    const bPos = which === 'B'
      ? [lat, lng]
      : markerBRef.current?.getLatLng() ? [markerBRef.current.getLatLng().lat, markerBRef.current.getLatLng().lng] : null

    if (aPos && bPos) {
      polylineRef.current = L.polyline([aPos, bPos], {
        color: '#6366f1',
        weight: 3,
        opacity: 0.6,
        dashArray: '8 6',
      }).addTo(map)
      map.fitBounds(L.latLngBounds([aPos, bPos]), { padding: [40, 40] })
    } else {
      map.setView([lat, lng], 14, { animate: true })
    }
  }

  function handleReset() {
    if (markerARef.current) { markerARef.current.remove(); markerARef.current = null }
    if (markerBRef.current) { markerBRef.current.remove(); markerBRef.current = null }
    if (polylineRef.current) { polylineRef.current.remove(); polylineRef.current = null }
    onChange('startLat', ''); onChange('startLng', '')
    onChange('endLat', '');   onChange('endLng', '')
    stepRef.current = 'A'
    setStep('A')
  }

  return (
    <div>
      {/* Instruction bar */}
      <div className={`flex items-center justify-between px-4 py-2.5 rounded-t-xl text-sm font-semibold ${
        step === 'A' ? 'bg-green-600 text-white' :
        step === 'B' ? 'bg-brand-red text-white' :
        'bg-indigo-600 text-white'
      }`}>
        <div className="flex items-center gap-2">
          <MapPin size={15} />
          {step === 'A' && 'Klicke auf die Karte: Startpunkt A setzen'}
          {step === 'B' && 'Klicke auf die Karte: Zielpunkt B setzen'}
          {step === 'done' && '✓ Beide Punkte gesetzt — Route bereit'}
        </div>
        <button onClick={handleReset} title="Zurücksetzen"
          className="flex items-center gap-1 text-white/80 hover:text-white transition-colors text-xs">
          <RotateCcw size={13} /> Reset
        </button>
      </div>

      {/* Map */}
      <div
        ref={containerRef}
        className="w-full rounded-b-xl overflow-hidden border border-gray-200 border-t-0"
        style={{ height: 300, cursor: step === 'done' ? 'default' : 'crosshair' }}
      />

      {/* Coordinate display */}
      {(startLat || endLat) && (
        <div className="flex gap-3 mt-2">
          {startLat && (
            <div className="flex-1 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
              <div className="text-[10px] font-bold uppercase text-green-600 mb-0.5">Punkt A</div>
              <div className="text-xs font-mono text-green-800">{parseFloat(startLat).toFixed(4)}, {parseFloat(startLng).toFixed(4)}</div>
            </div>
          )}
          {endLat && (
            <div className="flex-1 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              <div className="text-[10px] font-bold uppercase text-brand-red mb-0.5">Punkt B</div>
              <div className="text-xs font-mono text-red-800">{parseFloat(endLat).toFixed(4)}, {parseFloat(endLng).toFixed(4)}</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
