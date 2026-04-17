'use client'

import { useEffect, useRef, useState } from 'react'
import { Navigation, Loader2, LocateFixed, MapPin, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const SHOP = { lat: 53.7074038, lng: 7.1451375 }

interface Props {
  de: boolean
}

export default function LiveMap({ de }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const userMarkerRef = useRef<any>(null)
  const routeLayerRef = useRef<any>(null)
  const watchIdRef = useRef<number | null>(null)
  const LRef = useRef<any>(null)

  const [status, setStatus] = useState<'idle' | 'loading' | 'active' | 'denied'>('idle')
  const [distance, setDistance] = useState<string | null>(null)
  const [duration, setDuration] = useState<string | null>(null)

  // Init map once
  useEffect(() => {
    if (mapRef.current || !containerRef.current) return

    // Load Leaflet CSS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    import('leaflet').then((L) => {
      LRef.current = L

      // Fix default icons
      const DefaultIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41], iconAnchor: [12, 41],
      })
      L.Marker.prototype.options.icon = DefaultIcon

      const map = L.map(containerRef.current!, {
        center: [SHOP.lat, SHOP.lng],
        zoom: 18,
        zoomControl: true,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)

      // Shop pin
      const shopIcon = L.divIcon({
        html: `
          <div style="display:flex;flex-direction:column;align-items:center">
            <div style="background:#D12B2B;width:40px;height:40px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 3px 12px rgba(0,0,0,0.35)"></div>
          </div>`,
        className: '',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -44],
      })

      L.marker([SHOP.lat, SHOP.lng], { icon: shopIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family:sans-serif;min-width:160px">
            <div style="font-weight:700;font-size:14px;margin-bottom:4px">🚲 Drahtesel</div>
            <div style="font-size:12px;color:#555">Herrenpfad 21-22<br>26548 Norderney</div>
            <div style="font-size:12px;color:#555;margin-top:4px">Mo–So: 09:00–18:00</div>
          </div>`, { maxWidth: 200 })
        .openPopup()

      mapRef.current = map
    })

    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current)
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null }
    }
  }, [])

  async function fetchRoute(lat: number, lng: number) {
    try {
      const res = await fetch(
        `https://router.project-osrm.org/route/v1/foot/${lng},${lat};${SHOP.lng},${SHOP.lat}?overview=full&geometries=geojson`
      )
      const data = await res.json()
      const route = data.routes?.[0]
      if (!route || !mapRef.current || !LRef.current) return

      const L = LRef.current
      const meters = route.distance
      const secs = route.duration

      setDistance(meters < 1000 ? `${Math.round(meters)} m` : `${(meters / 1000).toFixed(1)} km`)
      setDuration(`${Math.round(secs / 60)} min`)

      if (routeLayerRef.current) mapRef.current.removeLayer(routeLayerRef.current)
      routeLayerRef.current = L.geoJSON(route.geometry, {
        style: { color: '#D12B2B', weight: 5, opacity: 0.85, dashArray: undefined },
      }).addTo(mapRef.current)
    } catch {}
  }

  function startTracking() {
    if (!navigator.geolocation) { setStatus('denied'); return }
    setStatus('loading')

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords
        setStatus('active')

        if (!mapRef.current || !LRef.current) return
        const L = LRef.current

        // User dot
        const userIcon = L.divIcon({
          html: `<div style="width:18px;height:18px;background:#2563EB;border-radius:50%;border:3px solid white;box-shadow:0 0 0 5px rgba(37,99,235,0.25)"></div>`,
          className: '',
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        })

        if (!userMarkerRef.current) {
          userMarkerRef.current = L.marker([lat, lng], { icon: userIcon, zIndexOffset: 1000 })
            .addTo(mapRef.current)
            .bindPopup(de ? '📍 Du bist hier' : '📍 You are here')
          // Fit map to show both user and shop
          const bounds = L.latLngBounds([[lat, lng], [SHOP.lat, SHOP.lng]])
          mapRef.current.fitBounds(bounds, { padding: [60, 60] })
        } else {
          userMarkerRef.current.setLatLng([lat, lng])
        }

        fetchRoute(lat, lng)
      },
      () => setStatus('denied'),
      { enableHighAccuracy: true, maximumAge: 3000, timeout: 15000 }
    )
  }

  function stopTracking() {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
    if (userMarkerRef.current && mapRef.current) {
      mapRef.current.removeLayer(userMarkerRef.current)
      userMarkerRef.current = null
    }
    if (routeLayerRef.current && mapRef.current) {
      mapRef.current.removeLayer(routeLayerRef.current)
      routeLayerRef.current = null
    }
    mapRef.current?.setView([SHOP.lat, SHOP.lng], 16)
    setStatus('idle')
    setDistance(null)
    setDuration(null)
  }

  return (
    <div className="relative w-full h-[420px] md:h-[560px]">
      {/* Map */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full z-0" />

      {/* Live info banner */}
      {status === 'active' && distance && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white rounded-2xl shadow-xl px-5 py-3 flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs font-semibold text-brand-black">{de ? 'Live' : 'Live'}</span>
          </div>
          <div className="text-center">
            <div className="text-lg font-extrabold text-brand-black leading-none">{distance}</div>
            <div className="text-[10px] text-brand-gray">{de ? 'Entfernung' : 'Distance'}</div>
          </div>
          {duration && (
            <>
              <div className="w-px h-8 bg-gray-200" />
              <div className="text-center">
                <div className="text-lg font-extrabold text-brand-black leading-none">{duration}</div>
                <div className="text-[10px] text-brand-gray">{de ? 'zu Fuß' : 'walking'}</div>
              </div>
            </>
          )}
          <button onClick={stopTracking} className="ml-2 text-xs text-gray-400 hover:text-red-500 transition-colors">✕</button>
        </div>
      )}

      {/* Floating info card — desktop */}
      <div className="hidden md:block absolute top-8 right-8 z-[1000] w-80 bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-brand-red px-5 py-4">
          <div className="flex items-center gap-2 mb-0.5">
            <MapPin size={15} className="text-white" />
            <span className="text-white font-bold text-sm">Drahtesel Norderney</span>
          </div>
          <p className="text-white/75 text-xs">{de ? 'Fahrradverleih & Abholstation' : 'Bike Rental & Pickup'}</p>
        </div>
        <div className="px-5 py-4 flex flex-col gap-2.5 text-sm">
          <div className="flex items-center gap-2 text-brand-gray text-xs">
            <MapPin size={13} className="text-brand-red flex-shrink-0" />
            Herrenpfad 21-22, 26548 Norderney
          </div>
          <div className="flex items-center gap-2 text-brand-gray text-xs">
            <Clock size={13} className="text-brand-red flex-shrink-0" />
            {de ? 'Mo–So: 09:00 – 18:00 Uhr' : 'Mon–Sun: 09:00 – 18:00'}
          </div>
        </div>
        <div className="px-5 pb-5 flex flex-col gap-2">
          {status === 'idle' || status === 'denied' ? (
            <button onClick={startTracking}
              className="w-full flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-red-dark text-white font-semibold rounded-xl py-3 text-sm transition-all">
              <LocateFixed size={15} />
              {de ? 'Live-Navigation starten' : 'Start live navigation'}
            </button>
          ) : status === 'loading' ? (
            <button disabled className="w-full flex items-center justify-center gap-2 bg-brand-red/70 text-white font-semibold rounded-xl py-3 text-sm">
              <Loader2 size={15} className="animate-spin" />
              {de ? 'Standort wird ermittelt…' : 'Getting your location…'}
            </button>
          ) : (
            <button onClick={stopTracking}
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl py-3 text-sm transition-all">
              <LocateFixed size={15} />
              {de ? 'Navigation läuft ● Stop' : 'Navigating ● Stop'}
            </button>
          )}
          {status === 'denied' && (
            <p className="text-xs text-red-500 text-center">{de ? 'Standort verweigert — bitte in den Browser-Einstellungen erlauben.' : 'Location denied — please allow in browser settings.'}</p>
          )}
          <Link href="/bikes"
            className="flex items-center justify-center gap-2 border-2 border-brand-red text-brand-red hover:bg-brand-red hover:text-white font-semibold rounded-xl py-2.5 text-sm transition-all">
            {de ? 'Fahrrad buchen' : 'Book a Bike'} <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* Mobile bottom bar */}
      <div className="md:hidden absolute bottom-0 left-0 right-0 z-[1000] bg-white border-t border-gray-100 shadow-lg px-4 py-3">
        <div className="flex gap-2">
          {status === 'idle' || status === 'denied' ? (
            <button onClick={startTracking}
              className="flex-1 flex items-center justify-center gap-2 bg-brand-red text-white font-bold rounded-xl py-3 text-sm">
              <LocateFixed size={15} />
              {de ? 'Live-Navigation' : 'Live Navigate'}
            </button>
          ) : status === 'loading' ? (
            <button disabled className="flex-1 flex items-center justify-center gap-2 bg-brand-red/70 text-white font-bold rounded-xl py-3 text-sm">
              <Loader2 size={15} className="animate-spin" />
              {de ? 'Wird ermittelt…' : 'Locating…'}
            </button>
          ) : (
            <button onClick={stopTracking}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white font-bold rounded-xl py-3 text-sm">
              <LocateFixed size={15} className="animate-pulse" />
              {distance ? `${distance} · ${duration}` : (de ? 'Läuft ● Stop' : 'Live ● Stop')}
            </button>
          )}
          <Link href="/bikes"
            className="flex items-center justify-center gap-2 bg-brand-black text-white font-bold rounded-xl px-4 py-3 text-sm">
            {de ? 'Buchen' : 'Book'}
          </Link>
        </div>
      </div>
    </div>
  )
}
