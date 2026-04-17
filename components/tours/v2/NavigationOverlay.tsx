'use client'

import { X, ChevronLeft, ChevronRight, Flag, MapPin, Hotel } from 'lucide-react'
// Hotel used in footer label only
import clsx from 'clsx'
import type { Tour } from '@/lib/tours-data'
import type { StartLocation } from './StartLocationModal'

interface Props {
  tour: Tour
  stopIdx: number
  locale: 'de' | 'en'
  customStart?: StartLocation | null
  onNext: () => void
  onPrev: () => void
  onExit: () => void
}

// ─── Bearing between two lat/lng points ─────────────────────────────────────
function getBearing(from: [number, number], to: [number, number]): number {
  const [lat1, lon1] = from.map(d => (d * Math.PI) / 180)
  const [lat2, lon2] = to.map(d => (d * Math.PI) / 180)
  const dLon = lon2 - lon1
  const y = Math.sin(dLon) * Math.cos(lat2)
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon)
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360
}

// ─── Distance in meters ──────────────────────────────────────────────────────
function getDistanceM(a: [number, number], b: [number, number]): number {
  const R = 6371000
  const lat1 = (a[0] * Math.PI) / 180
  const lat2 = (b[0] * Math.PI) / 180
  const dLat = ((b[0] - a[0]) * Math.PI) / 180
  const dLon = ((b[1] - a[1]) * Math.PI) / 180
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s))
}

function formatDistance(m: number, de: boolean): string {
  if (m < 1000) return `${Math.round(m / 10) * 10}m`
  return `${(m / 1000).toFixed(1)} km`
}

// ─── Instruction from bearing ────────────────────────────────────────────────
function getInstruction(bearing: number, de: boolean): string {
  if (bearing > 337.5 || bearing <= 22.5)  return de ? 'Geradeaus fahren'    : 'Continue straight'
  if (bearing > 22.5  && bearing <= 67.5)  return de ? 'Halb rechts'          : 'Bear right'
  if (bearing > 67.5  && bearing <= 112.5) return de ? 'Rechts abbiegen'      : 'Turn right'
  if (bearing > 112.5 && bearing <= 157.5) return de ? 'Scharf rechts'        : 'Sharp right'
  if (bearing > 157.5 && bearing <= 202.5) return de ? 'Wenden'               : 'U-turn'
  if (bearing > 202.5 && bearing <= 247.5) return de ? 'Scharf links'         : 'Sharp left'
  if (bearing > 247.5 && bearing <= 292.5) return de ? 'Links abbiegen'       : 'Turn left'
  return de ? 'Halb links' : 'Bear left'
}

// ─── Direction arrow (rotatable SVG) ────────────────────────────────────────
function DirectionArrow({ bearing, size = 28 }: { bearing: number; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="white"
      width={size}
      height={size}
      style={{ transform: `rotate(${bearing}deg)`, transition: 'transform 0.5s ease' }}
    >
      {/* Arrow pointing up (north = 0°) */}
      <path d="M12 2.5l-6.5 11h3.5v8h6v-8h3.5L12 2.5z" />
    </svg>
  )
}

export default function NavigationOverlay({ tour, stopIdx, locale, customStart, onNext, onPrev, onExit }: Props) {
  const de = locale === 'de'
  const stops = tour.stops
  const currentStop = stops[stopIdx]
  const nextStop = stops[stopIdx + 1] ?? null
  const isLast = stopIdx === stops.length - 1
  const isFirst = stopIdx === 0

  let bearing = 0
  let distanceM = 0
  let instruction = de ? 'Ziel erreicht!' : 'You have arrived!'

  if (nextStop) {
    bearing = getBearing(currentStop.coords, nextStop.coords)
    distanceM = getDistanceM(currentStop.coords, nextStop.coords)
    instruction = getInstruction(bearing, de)
  }

  const progressPct = stops.length > 1
    ? Math.round((stopIdx / (stops.length - 1)) * 100)
    : 100

  return (
    <div className="absolute inset-0 z-[1080] pointer-events-none flex flex-col justify-between">
      {/* ── TOP: Direction card ───────────────────────────────────────────── */}
      <div className="pointer-events-auto m-3 mt-2">
        {/* Exit row */}
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={onExit}
            className="h-9 px-3 bg-white/95 backdrop-blur rounded-xl shadow-md flex items-center gap-1.5 text-brand-gray hover:text-brand-black transition-colors"
          >
            <X size={15} />
            <span className="text-[12px] font-bold">{de ? 'Zurück' : 'Back'}</span>
          </button>
          <span className="text-[11px] font-semibold text-white/70 bg-black/30 backdrop-blur px-3 py-1.5 rounded-full">
            {de ? `Station ${stopIdx + 1} / ${stops.length}` : `Stop ${stopIdx + 1} / ${stops.length}`}
          </span>
        </div>

        <div className="bg-brand-black/92 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex items-stretch gap-0">
            {/* Direction block */}
            <div
              className="flex-shrink-0 w-[72px] flex items-center justify-center rounded-l-2xl"
              style={{ backgroundColor: isLast ? '#16a34a' : tour.color }}
            >
              {isLast
                ? <Flag size={28} color="white" />
                : <DirectionArrow bearing={bearing} size={28} />
              }
            </div>

            {/* Text */}
            <div className="flex-1 px-4 py-3.5">
              <div className="text-white font-extrabold text-[17px] leading-tight">
                {instruction}
              </div>
              {nextStop && !isLast && (
                <div className="text-white/55 text-[12px] mt-1 flex items-center gap-1.5">
                  <span className="text-white/80 font-bold">{formatDistance(distanceM, de)}</span>
                  <span>→</span>
                  <span className="truncate">{de ? nextStop.title.de : nextStop.title.en}</span>
                </div>
              )}
              {isLast && (
                <div className="text-white/55 text-[12px] mt-1">
                  {de ? `Ankunft: ${currentStop.title.de}` : `Arrived: ${currentStop.title.en}`}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* ── Transparent middle (map shows through) ──────────────────────── */}
      <div className="flex-1" />

      {/* ── BOTTOM: Progress + controls ──────────────────────────────────── */}
      <div className="pointer-events-auto m-3 mb-24 md:mb-4">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden">
          {/* Progress bar */}
          <div className="h-1 bg-gray-100">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%`, backgroundColor: tour.color }}
            />
          </div>

          <div className="px-4 py-3 flex items-center gap-3">
            {/* Current stop info */}
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <span
                className="w-8 h-8 rounded-full text-white font-extrabold text-[13px] flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: tour.color }}
              >
                {stopIdx + 1}
              </span>
              <div className="min-w-0">
                <div className="text-[11px] text-brand-gray font-semibold">
                  {de ? `Station ${stopIdx + 1} von ${stops.length}` : `Stop ${stopIdx + 1} of ${stops.length}`}
                </div>
                <div className="text-[13px] font-extrabold text-brand-black truncate">
                  {de ? currentStop.title.de : currentStop.title.en}
                </div>
                <div className="text-[11px] font-semibold" style={{ color: tour.color }}>
                  {de ? currentStop.label.de : currentStop.label.en}
                </div>
              </div>
            </div>

            {/* Prev / Next */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={onPrev}
                disabled={isFirst}
                className={clsx(
                  'w-10 h-10 rounded-xl flex items-center justify-center transition-colors',
                  isFirst
                    ? 'text-gray-200 bg-gray-50 cursor-not-allowed'
                    : 'text-brand-gray bg-gray-100 hover:bg-gray-200 active:scale-95'
                )}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={onNext}
                disabled={isLast}
                className={clsx(
                  'w-10 h-10 rounded-xl flex items-center justify-center text-white transition-colors active:scale-95',
                  isLast ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
                )}
                style={{ backgroundColor: isLast ? '#9ca3af' : tour.color }}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Custom start label */}
          {customStart && (
            <div className="px-4 pb-3 flex items-center gap-1.5">
              <Hotel size={10} className="text-brand-gray/50" />
              <span className="text-[10px] text-brand-gray/50 truncate">
                {de ? `Start: ${customStart.label}` : `From: ${customStart.label}`}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
