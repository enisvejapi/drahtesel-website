'use client'

import { useState, useRef, useEffect } from 'react'
import { MapPin, Search, Navigation2, X, Loader2, Hotel, CheckCircle2 } from 'lucide-react'

export type StartLocation = { lat: number; lng: number; label: string }

interface Props {
  tourColor: string
  locale: 'de' | 'en'
  onConfirm: (loc: StartLocation | null) => void // null = skip (start from stop 1)
  onCancel: () => void
}

type Tab = 'gps' | 'search'
type GpsStatus = 'idle' | 'loading' | 'ok' | 'denied'

type NominatimResult = {
  place_id: number
  display_name: string
  lat: string
  lon: string
}

export default function StartLocationModal({ tourColor, locale, onConfirm, onCancel }: Props) {
  const de = locale === 'de'
  const [tab, setTab] = useState<Tab>('gps')
  const [gpsStatus, setGpsStatus] = useState<GpsStatus>('idle')
  const [gpsLoc, setGpsLoc] = useState<StartLocation | null>(null)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<NominatimResult[]>([])
  const [searching, setSearching] = useState(false)
  const [selected, setSelected] = useState<StartLocation | null>(null)
  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-focus search input when switching to search tab
  useEffect(() => {
    if (tab === 'search') setTimeout(() => inputRef.current?.focus(), 100)
  }, [tab])

  function detectGps() {
    if (!navigator.geolocation) { setGpsStatus('denied'); return }
    setGpsStatus('loading')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        // If GPS is outside Norderney, still accept but snap map to island
        const label = isOnNorderney(lat, lng)
          ? (de ? 'Mein Standort' : 'My location')
          : (de ? 'Mein Standort (außerhalb Norderneys)' : 'My location (outside Norderney)')
        setGpsLoc({ lat, lng, label })
        setGpsStatus('ok')
      },
      () => setGpsStatus('denied'),
      { timeout: 12000, enableHighAccuracy: true }
    )
  }

  // Norderney bounding box (full island)
  const NORDERNEY_BOUNDS = { latMin: 53.685, latMax: 53.730, lngMin: 7.080, lngMax: 7.280 }

  function isOnNorderney(lat: number, lng: number) {
    return lat >= NORDERNEY_BOUNDS.latMin && lat <= NORDERNEY_BOUNDS.latMax
      && lng >= NORDERNEY_BOUNDS.lngMin && lng <= NORDERNEY_BOUNDS.lngMax
  }

  function handleSearch(val: string) {
    setQuery(val)
    setSelected(null)
    if (searchRef.current) clearTimeout(searchRef.current)
    if (!val.trim() || val.trim().length < 2) { setResults([]); return }

    searchRef.current = setTimeout(async () => {
      setSearching(true)
      try {
        // viewbox: lon_min,lat_min,lon_max,lat_max — Norderney only, no Juist or Baltrum
        const viewbox = `${NORDERNEY_BOUNDS.lngMin},${NORDERNEY_BOUNDS.latMin},${NORDERNEY_BOUNDS.lngMax},${NORDERNEY_BOUNDS.latMax}`
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(val + ' Norderney')}&format=json&limit=8&countrycodes=de&viewbox=${viewbox}&bounded=1`
        const res = await fetch(url, { headers: { 'Accept-Language': de ? 'de' : 'en' } })
        const data: NominatimResult[] = await res.json()
        // Extra client-side filter: only results actually on the island
        setResults(data.filter(r => isOnNorderney(parseFloat(r.lat), parseFloat(r.lon))))
      } catch { setResults([]) }
      setSearching(false)
    }, 400)
  }

  const confirmLoc = tab === 'gps' ? gpsLoc : selected
  const canConfirm = !!confirmLoc

  return (
    <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92dvh]">

        {/* Header */}
        <div className="flex-shrink-0 flex items-start justify-between px-5 pt-5 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">
              {de ? 'Wo startest du?' : 'Where are you starting?'}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {de
                ? 'Wähle deinen Startpunkt — wir führen dich zur ersten Station.'
                : 'Set your start — we\'ll guide you to the first stop.'}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="flex-shrink-0 p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex-shrink-0 flex gap-2 px-5 pt-4 pb-3">
          <TabBtn
            active={tab === 'gps'}
            onClick={() => { setTab('gps'); setSelected(null) }}
            icon={<Navigation2 size={14} />}
            label={de ? 'GPS-Standort' : 'GPS Location'}
            color={tourColor}
          />
          <TabBtn
            active={tab === 'search'}
            onClick={() => { setTab('search'); setGpsLoc(null); setGpsStatus('idle') }}
            icon={<Search size={14} />}
            label={de ? 'Hotel / Adresse' : 'Hotel / Address'}
            color={tourColor}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 pb-2">

          {/* ── GPS Tab ── */}
          {tab === 'gps' && (
            <div className="py-2">
              {gpsStatus === 'idle' && (
                <button
                  onClick={detectGps}
                  className="w-full flex items-center gap-3 p-4 rounded-2xl border-2 border-dashed border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${tourColor}20` }}>
                    <Navigation2 size={20} style={{ color: tourColor }} />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-gray-900">
                      {de ? 'Standort ermitteln' : 'Detect my location'}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {de ? 'Nutzt dein GPS — am genauesten' : 'Uses your GPS — most accurate'}
                    </div>
                  </div>
                </button>
              )}

              {gpsStatus === 'loading' && (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50">
                  <Loader2 size={20} className="animate-spin flex-shrink-0" style={{ color: tourColor }} />
                  <span className="text-sm text-gray-600">{de ? 'GPS wird ermittelt…' : 'Getting GPS…'}</span>
                </div>
              )}

              {gpsStatus === 'ok' && gpsLoc && (
                <div className="flex items-center gap-3 p-4 rounded-2xl border-2" style={{ borderColor: tourColor, backgroundColor: `${tourColor}0d` }}>
                  <CheckCircle2 size={20} className="flex-shrink-0" style={{ color: tourColor }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold" style={{ color: tourColor }}>
                      {de ? 'Standort erkannt!' : 'Location found!'}
                    </div>
                    <div className="text-xs text-gray-500 font-mono mt-0.5">
                      {gpsLoc.lat.toFixed(5)}, {gpsLoc.lng.toFixed(5)}
                    </div>
                  </div>
                  <button
                    onClick={() => { setGpsLoc(null); setGpsStatus('idle') }}
                    className="text-xs text-gray-400 hover:text-gray-600 underline flex-shrink-0"
                  >
                    {de ? 'Neu' : 'Retry'}
                  </button>
                </div>
              )}

              {gpsStatus === 'denied' && (
                <div className="p-4 rounded-2xl bg-yellow-50 border border-yellow-200">
                  <p className="text-sm font-semibold text-yellow-800 mb-1">
                    {de ? 'GPS nicht verfügbar' : 'GPS unavailable'}
                  </p>
                  <p className="text-xs text-yellow-700">
                    {de
                      ? 'Standortzugriff verweigert. Suche stattdessen nach deiner Adresse.'
                      : 'Location access denied. Try searching for your address instead.'}
                  </p>
                  <button
                    onClick={() => setTab('search')}
                    className="mt-2 text-xs font-semibold underline text-yellow-800"
                  >
                    {de ? 'Zur Adresssuche →' : 'Search address →'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── Search Tab ── */}
          {tab === 'search' && (
            <div className="py-2 flex flex-col gap-2">
              {/* Input */}
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder={de ? 'Hotel oder Adresse auf Norderney…' : 'Hotel or address on Norderney…'}
                  className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                  style={{ '--tw-ring-color': tourColor } as React.CSSProperties}
                />
                {searching && (
                  <Loader2 size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 animate-spin text-gray-400" />
                )}
              </div>

              {/* Results */}
              {results.length > 0 && (
                <div className="flex flex-col gap-1.5 mt-1">
                  {results.map((r) => {
                    const isSelected = selected?.lat === parseFloat(r.lat) && selected?.lng === parseFloat(r.lon)
                    const shortName = r.display_name.split(',').slice(0, 2).join(', ')
                    return (
                      <button
                        key={r.place_id}
                        onClick={() => setSelected({
                          lat: parseFloat(r.lat),
                          lng: parseFloat(r.lon),
                          label: shortName,
                        })}
                        className="w-full text-left flex items-center gap-3 p-3 rounded-xl border-2 transition-all"
                        style={isSelected
                          ? { borderColor: tourColor, backgroundColor: `${tourColor}0d` }
                          : { borderColor: 'transparent', backgroundColor: '#f9fafb' }
                        }
                      >
                        <Hotel size={16} className="flex-shrink-0 text-gray-400" />
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-gray-900 truncate">{shortName}</div>
                          <div className="text-xs text-gray-400 truncate">{r.display_name.split(',').slice(2, 4).join(', ')}</div>
                        </div>
                        {isSelected && <CheckCircle2 size={16} className="flex-shrink-0 ml-auto" style={{ color: tourColor }} />}
                      </button>
                    )
                  })}
                </div>
              )}

              {!searching && query.length >= 2 && results.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">
                  {de ? 'Keine Ergebnisse gefunden.' : 'No results found.'}
                </p>
              )}

              {query.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-2">
                  {de ? 'Nur Adressen auf Norderney werden angezeigt' : 'Only addresses on Norderney are shown'}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex-shrink-0 px-5 pt-3 pb-5 border-t border-gray-100 flex flex-col gap-2">
          <button
            onClick={() => onConfirm(confirmLoc)}
            disabled={!canConfirm}
            className="w-full flex items-center justify-center gap-2 text-white text-sm font-extrabold py-4 rounded-2xl transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: canConfirm ? tourColor : '#9ca3af', boxShadow: canConfirm ? `0 6px 20px ${tourColor}40` : 'none' }}
          >
            <MapPin size={16} />
            {de ? 'Tour von hier starten' : 'Start tour from here'}
          </button>
          <button
            onClick={() => onConfirm(null)}
            className="w-full text-sm font-semibold text-gray-400 hover:text-gray-600 py-2 transition-colors"
          >
            {de ? 'Überspringen — direkt zu Station 1' : 'Skip — go directly to stop 1'}
          </button>
        </div>

      </div>
    </div>
  )
}

function TabBtn({ active, onClick, icon, label, color }: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
  color: string
}) {
  return (
    <button
      onClick={onClick}
      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-bold transition-all"
      style={active
        ? { backgroundColor: `${color}18`, color }
        : { backgroundColor: '#f3f4f6', color: '#6b7280' }
      }
    >
      {icon}
      {label}
    </button>
  )
}
