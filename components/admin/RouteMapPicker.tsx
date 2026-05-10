'use client'

import { useEffect, useRef, useState } from 'react'
import { MapPin, RotateCcw, Plus } from 'lucide-react'

interface Props {
  endLat: string
  endLng: string
  waypoints: [number, number][]
  onChange: (field: 'endLat' | 'endLng', value: string) => void
  onWaypointsChange: (wp: [number, number][]) => void
}

// Preview start for admin route drawing (Norderney harbor)
const PREVIEW_START: [number, number] = [53.7040, 7.1620]

function decodePolyline(encoded: string): [number, number][] {
  const factor = 1e6
  const result: [number, number][] = []
  let idx = 0, lat = 0, lng = 0
  while (idx < encoded.length) {
    let b, shift = 0, res = 0
    do { b = encoded.charCodeAt(idx++) - 63; res |= (b & 0x1f) << shift; shift += 5 } while (b >= 0x20)
    lat += (res & 1) ? ~(res >> 1) : (res >> 1)
    shift = 0; res = 0
    do { b = encoded.charCodeAt(idx++) - 63; res |= (b & 0x1f) << shift; shift += 5 } while (b >= 0x20)
    lng += (res & 1) ? ~(res >> 1) : (res >> 1)
    result.push([lat / factor, lng / factor])
  }
  return result
}

export default function RouteMapPicker({ endLat, endLng, waypoints, onChange, onWaypointsChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const LRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerBRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const wpMarkersRef = useRef<any[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const routeLayerRef = useRef<any>(null)
  const [mode, setMode] = useState<'set-b' | 'add-waypoint'>('set-b')
  const [previewLoading, setPreviewLoading] = useState(false)

  // Stable refs so map click closure always sees latest values
  const endLatRef = useRef(endLat)
  const endLngRef = useRef(endLng)
  const waypointsRef = useRef(waypoints)
  const modeRef = useRef(mode)
  const onChangeRef = useRef(onChange)
  const onWpChangeRef = useRef(onWaypointsChange)

  useEffect(() => { endLatRef.current = endLat }, [endLat])
  useEffect(() => { endLngRef.current = endLng }, [endLng])
  useEffect(() => { waypointsRef.current = waypoints }, [waypoints])
  useEffect(() => { modeRef.current = mode }, [mode])
  useEffect(() => { onChangeRef.current = onChange }, [onChange])
  useEffect(() => { onWpChangeRef.current = onWaypointsChange }, [onWaypointsChange])

  // ── Init map (once) ─────────────────────────────────────────────────────────
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
        if (!endLatRef.current || modeRef.current === 'set-b') {
          // Set / replace destination B
          onChangeRef.current('endLat', lat.toFixed(6))
          onChangeRef.current('endLng', lng.toFixed(6))
          setMode('add-waypoint')
        } else if (modeRef.current === 'add-waypoint') {
          // Add via-waypoint
          onWpChangeRef.current([...waypointsRef.current, [lat, lng]])
        }
      })

      setTimeout(() => map.invalidateSize(), 100)

      // Restore edit state
      if (endLat && endLng) {
        placeMarkerB(parseFloat(endLat), parseFloat(endLng), false)
        if (waypoints.length > 0) setMode('add-waypoint')
      }
    })

    return () => {
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Redraw markers + route whenever props change ─────────────────────────────
  useEffect(() => {
    const L = LRef.current
    const map = mapRef.current
    if (!L || !map) return

    // B marker
    if (endLat && endLng) {
      placeMarkerB(parseFloat(endLat), parseFloat(endLng), false)
    } else {
      if (markerBRef.current) { markerBRef.current.remove(); markerBRef.current = null }
    }

    // Waypoint markers
    wpMarkersRef.current.forEach(m => m.remove())
    wpMarkersRef.current = []

    waypoints.forEach(([lat, lng], idx) => {
      const icon = L.divIcon({
        className: '',
        html: `<div style="width:26px;height:26px;background:#6366f1;border:3px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:10px;font-weight:900;box-shadow:0 2px 8px rgba(0,0,0,0.35);cursor:pointer;user-select:none;">W${idx + 1}</div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      })
      const marker = L.marker([lat, lng], { icon }).addTo(map)

      // Right-click removes this waypoint
      marker.on('contextmenu', (e: Event) => {
        e.stopPropagation?.()
        onWpChangeRef.current(waypointsRef.current.filter((_, i) => i !== idx))
      })

      wpMarkersRef.current.push(marker)
    })

    // Route preview
    if (endLat && endLng) {
      drawRoutePreview(waypoints, parseFloat(endLat), parseFloat(endLng))
    } else {
      if (routeLayerRef.current) { routeLayerRef.current.remove(); routeLayerRef.current = null }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endLat, endLng, JSON.stringify(waypoints)])

  // ── Helpers ─────────────────────────────────────────────────────────────────
  function placeMarkerB(lat: number, lng: number, pan = true) {
    const L = LRef.current
    const map = mapRef.current
    if (!L || !map) return

    const icon = L.divIcon({
      className: '',
      html: `
        <div style="display:flex;flex-direction:column;align-items:center;">
          <div style="position:relative;width:36px;height:46px;filter:drop-shadow(0 3px 8px rgba(0,0,0,0.3));">
            <svg viewBox="0 0 52 66" width="36" height="46" fill="none">
              <path d="M26 2C15.51 2 7 10.51 7 21c0 12.88 19 43 19 43S45 33.88 45 21C45 10.51 36.49 2 26 2z" fill="#C8102E"/>
              <circle cx="26" cy="21" r="13" fill="white"/>
            </svg>
            <div style="position:absolute;top:3px;left:50%;transform:translateX(-50%);font-size:15px;font-weight:900;color:#C8102E;font-family:system-ui,sans-serif;">B</div>
          </div>
        </div>`,
      iconSize: [36, 46],
      iconAnchor: [18, 46],
    })

    if (markerBRef.current) markerBRef.current.remove()
    markerBRef.current = L.marker([lat, lng], { icon }).addTo(map)
    if (pan) map.setView([lat, lng], 14, { animate: true })
  }

  async function drawRoutePreview(wps: [number, number][], eLat: number, eLng: number) {
    const L = LRef.current
    const map = mapRef.current
    if (!L || !map) return

    setPreviewLoading(true)
    try {
      const locations = [
        { lat: PREVIEW_START[0], lon: PREVIEW_START[1], type: 'break' },
        ...wps.map(([lat, lng]) => ({ lat, lon: lng, type: 'through' })),
        { lat: eLat, lon: eLng, type: 'break' },
      ]

      const res = await fetch('https://valhalla1.openstreetmap.de/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locations,
          costing: 'bicycle',
          costing_options: {
            bicycle: { bicycle_type: 'Mountain', use_roads: 0.0, use_hills: 0.2, use_ferry: 0, avoid_bad_surfaces: 0.1 },
          },
          units: 'km',
        }),
      })
      if (!res.ok) return
      const data = await res.json()
      if (!data.trip?.legs?.length) return

      const allCoords: [number, number][] = []
      for (const leg of data.trip.legs) {
        allCoords.push(...decodePolyline(leg.shape))
      }

      if (routeLayerRef.current) routeLayerRef.current.remove()
      routeLayerRef.current = L.polyline(allCoords, { color: '#C8102E', weight: 4, opacity: 0.75, dashArray: undefined }).addTo(map)
    } catch {
      // silently ignore preview errors
    } finally {
      setPreviewLoading(false)
    }
  }

  function handleReset() {
    if (markerBRef.current) { markerBRef.current.remove(); markerBRef.current = null }
    wpMarkersRef.current.forEach(m => m.remove()); wpMarkersRef.current = []
    if (routeLayerRef.current) { routeLayerRef.current.remove(); routeLayerRef.current = null }
    onChange('endLat', '')
    onChange('endLng', '')
    onWaypointsChange([])
    setMode('set-b')
  }

  const hasB = !!endLat

  return (
    <div>
      {/* Instruction bar */}
      <div className={`flex items-center justify-between px-4 py-2.5 rounded-t-xl text-xs font-semibold ${
        !hasB ? 'bg-brand-red text-white' : mode === 'add-waypoint' ? 'bg-indigo-600 text-white' : 'bg-green-600 text-white'
      }`}>
        <div className="flex items-center gap-2">
          <MapPin size={13} />
          {!hasB && 'Klicke auf die Karte um Zielpunkt B zu setzen'}
          {hasB && mode === 'set-b' && '✓ B gesetzt — oder klicke neu um B zu verschieben'}
          {hasB && mode === 'add-waypoint' && 'Klicke auf Straßen für Wegpunkte · Rechtsklick entfernt'}
        </div>
        <div className="flex items-center gap-2">
          {hasB && (
            <button
              onClick={() => setMode(m => m === 'set-b' ? 'add-waypoint' : 'set-b')}
              className="flex items-center gap-1 border border-white/40 hover:border-white rounded-lg px-2 py-0.5 text-white/80 hover:text-white transition-colors"
            >
              {mode === 'add-waypoint'
                ? <><MapPin size={10} /> Ziel neu setzen</>
                : <><Plus size={10} /> Wegpunkte</>
              }
            </button>
          )}
          <button onClick={handleReset} className="flex items-center gap-1 text-white/70 hover:text-white transition-colors">
            <RotateCcw size={12} /> Reset
          </button>
        </div>
      </div>

      {/* Map */}
      <div
        ref={containerRef}
        className="w-full overflow-hidden border border-gray-200 border-t-0"
        style={{
          height: 340,
          borderRadius: waypoints.length === 0 && !hasB ? '0 0 12px 12px' : '0',
          cursor: !hasB ? 'crosshair' : mode === 'add-waypoint' ? 'cell' : 'default',
          position: 'relative',
        }}
      >
        {previewLoading && (
          <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 1000 }}
            className="bg-white/90 rounded-lg px-2 py-1 text-[11px] font-semibold text-gray-600 flex items-center gap-1.5 shadow">
            <div className="w-3 h-3 border-2 border-brand-red border-t-transparent rounded-full animate-spin" />
            Route…
          </div>
        )}
      </div>

      {/* Info row */}
      {hasB && (
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex gap-2">
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 flex items-center gap-2">
              <MapPin size={12} className="text-green-500 flex-shrink-0" />
              <div>
                <div className="text-[10px] font-bold uppercase text-gray-400 mb-0.5">Punkt A — GPS des Gastes</div>
                <div className="text-xs text-gray-400 italic">Wird automatisch ermittelt</div>
              </div>
            </div>
            <div className="flex-1 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              <div className="text-[10px] font-bold uppercase text-brand-red mb-0.5">Punkt B — Ziel</div>
              <div className="text-xs font-mono text-red-800">{parseFloat(endLat).toFixed(4)}, {parseFloat(endLng).toFixed(4)}</div>
            </div>
          </div>

          {waypoints.length > 0 && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-3 py-2">
              <div className="text-[10px] font-bold uppercase text-indigo-600 mb-1.5">
                Wegpunkte ({waypoints.length}) — klicken zum Entfernen
              </div>
              <div className="flex flex-wrap gap-1.5">
                {waypoints.map(([lat, lng], i) => (
                  <button
                    key={i}
                    onClick={() => onWaypointsChange(waypoints.filter((_, j) => j !== i))}
                    className="flex items-center gap-1 bg-indigo-100 hover:bg-red-100 border border-indigo-200 hover:border-red-300 text-indigo-700 hover:text-red-600 rounded-lg px-2 py-0.5 text-[10px] font-bold transition-colors"
                  >
                    W{i + 1} · {lat.toFixed(3)}, {lng.toFixed(3)} ×
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
