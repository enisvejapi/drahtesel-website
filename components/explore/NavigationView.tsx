'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { X, Flag, Maximize2, Minimize2 } from 'lucide-react'
import type { InterestPin } from '@/lib/interest-pins'
import { PIN_CATEGORIES } from '@/lib/interest-pins'
import type { RouteStep } from './ExploreMap'

interface Props {
  pin: InterestPin
  steps: RouteStep[]
  stepIdx: number
  totalDistance: number
  distanceTraveled?: number
  userLat?: number
  userLng?: number
  locale: 'de' | 'en'
  onExit: () => void
}

function haversine(a: [number, number], b: [number, number]): number {
  const R = 6371000
  const lat1 = (a[0] * Math.PI) / 180
  const lat2 = (b[0] * Math.PI) / 180
  const dLat = ((b[0] - a[0]) * Math.PI) / 180
  const dLon = ((b[1] - a[1]) * Math.PI) / 180
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s))
}

function fmtDist(m: number) {
  if (m < 1000) return `${Math.round(m / 10) * 10} m`
  return `${(m / 1000).toFixed(1)} km`
}

// ── Direction arrow — a single triangle rotated per maneuver ─────────────────
const MODIFIER_ANGLE: Record<string, number> = {
  'straight':    0,
  'slight right': 35,
  'right':        90,
  'sharp right':  140,
  'uturn':        180,
  'sharp left':  -140,
  'left':         -90,
  'slight left':  -35,
}

function ManeuverArrow({ type, modifier, color, size = 36 }: {
  type: string
  modifier: string
  color: string
  size?: number
}) {
  if (type === 'arrive') {
    return <Flag size={size} color="white" />
  }

  const angle = MODIFIER_ANGLE[modifier] ?? 0

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="white"
      style={{ transform: `rotate(${angle}deg)`, transition: 'transform 0.4s ease' }}
    >
      {/* Up-pointing navigation arrow */}
      <path d="M12 2.5L5 20l7-4.5 7 4.5L12 2.5z" />
    </svg>
  )
}

// ── Instruction text from OSRM maneuver ──────────────────────────────────────
function getInstruction(step: RouteStep, de: boolean): string {
  const { type, modifier, name } = step
  const road = name ? (de ? ` auf ${name}` : ` on ${name}`) : ''

  if (type === 'depart') return de ? `Los geht's${road}` : `Start${road}`
  if (type === 'arrive') return de ? 'Ziel erreicht!' : 'You have arrived!'
  if (type === 'roundabout' || type === 'rotary') return de ? `Kreisverkehr${road}` : `Roundabout${road}`
  if (type === 'fork') {
    if (modifier.includes('right')) return de ? `Rechts halten${road}` : `Keep right${road}`
    return de ? `Links halten${road}` : `Keep left${road}`
  }

  const turns: Record<string, { de: string; en: string }> = {
    'straight':    { de: 'Geradeaus',       en: 'Continue straight' },
    'slight right':{ de: 'Leicht rechts',   en: 'Bear right'        },
    'right':       { de: 'Rechts abbiegen', en: 'Turn right'        },
    'sharp right': { de: 'Scharf rechts',   en: 'Sharp right'       },
    'uturn':       { de: 'Wenden',          en: 'U-turn'            },
    'sharp left':  { de: 'Scharf links',    en: 'Sharp left'        },
    'left':        { de: 'Links abbiegen',  en: 'Turn left'         },
    'slight left': { de: 'Leicht links',    en: 'Bear left'         },
  }

  const t = turns[modifier] ?? turns['straight']
  return (de ? t.de : t.en) + road
}

export default function NavigationView({ pin, steps, stepIdx, totalDistance, distanceTraveled, userLat, userLng, locale, onExit }: Props) {
  const de = locale === 'de'
  const cat = PIN_CATEGORIES[pin.category]

  // ── Fullscreen ────────────────────────────────────────────────────────────
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showIosHint, setShowIosHint] = useState(false)
  const isIOS = useRef(typeof navigator !== 'undefined' && /iP(hone|ad|od)/.test(navigator.userAgent)).current

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  const toggleFullscreen = useCallback(() => {
    if (isIOS) { setShowIosHint(h => !h); return }
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {})
    } else {
      document.exitFullscreen?.().catch(() => {})
    }
  }, [isIOS])
  const step = steps[stepIdx]
  const nextStep = steps[stepIdx + 1] ?? null
  const isLast = stepIdx >= steps.length - 1

  // Remaining distance: haversine from user's GPS to destination (never affected by map pan)
  const distanceRemaining = (userLat !== undefined && userLng !== undefined)
    ? haversine([userLat, userLng], [pin.lat, pin.lng])
    : steps.slice(stepIdx).reduce((acc, s) => acc + s.distance, 0)

  // Progress: based on actual distance traveled by GPS (never jumps from map pan)
  const progressPct = totalDistance > 0
    ? Math.max(0, Math.min(100, Math.round(((distanceTraveled ?? 0) / totalDistance) * 100)))
    : 0

  if (!step) return null

  const instruction = getInstruction(step, de)
  const accentColor = isLast ? '#16a34a' : cat.color

  return (
    <div className="absolute inset-0 z-[1080] pointer-events-none flex flex-col nav-root">

      {/* ── TOP: Direction card ───────────────────────────────────────────── */}
      <div className="pointer-events-auto px-3 pb-2 nav-top-bar" style={{ paddingTop: 'max(12px, env(safe-area-inset-top))' }}>

        {/* Exit row */}
        <div className="flex items-center justify-between mb-2 nav-exit-row">
          <button
            onClick={onExit}
            className="h-9 px-3 bg-white/95 backdrop-blur rounded-xl shadow-md flex items-center gap-1.5 text-gray-600 hover:text-gray-900 transition-colors text-[12px] font-bold"
          >
            <X size={15} />
            <span className="nav-exit-label">{de ? 'Navigation beenden' : 'End navigation'}</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Fullscreen button */}
            <div className="relative">
              <button
                onClick={toggleFullscreen}
                className="h-9 w-9 bg-black/40 backdrop-blur rounded-xl flex items-center justify-center text-white/80 hover:text-white transition-colors"
              >
                {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
              </button>
              {showIosHint && (
                <div
                  className="absolute top-11 right-0 z-[2000] bg-black text-white text-[11px] font-semibold px-3 py-2.5 rounded-xl shadow-2xl w-56 leading-snug"
                  onClick={() => setShowIosHint(false)}
                >
                  <div className="font-extrabold mb-1">{de ? 'Vollbild auf iPhone' : 'Fullscreen on iPhone'}</div>
                  {de ? 'Teilen → „Zum Home-Bildschirm"' : 'Share → "Add to Home Screen"'}
                  <div className="text-white/40 text-[9px] mt-1.5">{de ? 'Tippen zum Schließen' : 'Tap to dismiss'}</div>
                </div>
              )}
            </div>

            <div className="bg-black/40 backdrop-blur text-white text-[11px] font-semibold px-3 py-1.5 rounded-full nav-remaining">
              {fmtDist(distanceRemaining)} {de ? 'verbleibend' : 'remaining'}
            </div>
          </div>
        </div>

        {/* Main instruction card */}
        <div className="bg-[#1a1a1a]/93 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden nav-card">
          <div className="flex items-stretch nav-card-inner">

            {/* Arrow block */}
            <div
              className="flex-shrink-0 w-[76px] flex items-center justify-center rounded-l-2xl nav-arrow-block"
              style={{ backgroundColor: accentColor }}
            >
              <ManeuverArrow type={step.type} modifier={step.modifier} color="white" size={30} />
            </div>

            {/* Text */}
            <div className="flex-1 px-4 py-3.5 nav-card-text">
              <div className="text-white/60 text-[11px] font-bold mb-0.5">
                {step.distance > 10 ? `${fmtDist(step.distance)} →` : (de ? 'Jetzt' : 'Now')}
              </div>
              <div className="text-white font-extrabold text-[18px] leading-tight nav-instruction">
                {instruction}
              </div>
              {nextStep && !isLast && (
                <div className="text-white/45 text-[11px] mt-1 truncate nav-next">
                  {de ? 'Dann: ' : 'Then: '}{getInstruction(nextStep, de)}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* ── Transparent middle — map shows through ───────────────────────── */}
      <div className="flex-1 nav-spacer" />

      {/* ── BOTTOM: Progress bar + destination ───────────────────────────── */}
      <div className="pointer-events-auto px-3 nav-bottom-bar">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden">
          {/* Progress bar */}
          <div className="h-1.5 bg-gray-100">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${progressPct}%`, backgroundColor: cat.color }}
            />
          </div>

          <div className="px-4 py-3 flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 nav-dest-icon"
              style={{ backgroundColor: `${cat.color}18` }}
            >
              {isLast ? '🏁' : cat.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] text-gray-500 font-semibold nav-dest-label">
                {de ? 'Ziel' : 'Destination'}
              </div>
              <div className="text-[14px] font-extrabold text-gray-900 truncate">
                {de ? pin.title.de : pin.title.en}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-[13px] font-extrabold" style={{ color: cat.color }}>
                {fmtDist(distanceRemaining)}
              </div>
              <div className="text-[10px] text-gray-400 font-semibold mt-0.5">
                {progressPct}% {de ? 'geschafft' : 'done'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* ── Portrait (default) ── */
        .nav-bottom-bar {
          padding-bottom: max(16px, env(safe-area-inset-bottom));
        }

        /* ── Landscape sidebar layout ── */
        @media (orientation: landscape) and (max-height: 500px) {

          /* Outer container: switch to row so sidebar sits left of map */
          .nav-root {
            flex-direction: row !important;
            align-items: stretch !important;
          }

          /* Left sidebar */
          .nav-top-bar {
            width: 210px !important;
            flex-shrink: 0 !important;
            display: flex !important;
            flex-direction: column !important;
            padding: max(8px, env(safe-area-inset-top)) 8px 8px 8px !important;
            gap: 6px !important;
          }

          /* Exit row: stack vertically, no justify-between */
          .nav-exit-row {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 5px !important;
          }

          /* Remaining pill: full width */
          .nav-remaining {
            width: 100% !important;
            text-align: center !important;
            border-radius: 10px !important;
          }

          /* Instruction card: grow to fill sidebar height */
          .nav-card {
            flex: 1 !important;
            display: flex !important;
            flex-direction: column !important;
          }
          .nav-card-inner {
            flex: 1 !important;
            flex-direction: column !important;
          }

          /* Arrow block: full width, fixed height */
          .nav-arrow-block {
            width: 100% !important;
            height: 56px !important;
            border-radius: 16px 16px 0 0 !important;
          }

          /* Text block: compact */
          .nav-card-text {
            padding: 10px 12px 12px !important;
          }
          .nav-instruction { font-size: 14px !important; }
          .nav-next        { display: none !important; }

          /* Spacer not needed in sidebar layout */
          .nav-spacer { display: none !important; }

          /* Bottom bar: slim strip at bottom-right of map */
          .nav-bottom-bar {
            position: absolute !important;
            bottom: 0 !important;
            left: 210px !important;
            right: 0 !important;
            padding: 4px 8px max(4px, env(safe-area-inset-bottom)) !important;
          }
          .nav-bottom-bar > div {
            border-radius: 14px 14px 0 0 !important;
          }
          .nav-dest-label { display: none !important; }
          .nav-dest-icon  { width: 28px !important; height: 28px !important; font-size: 13px !important; }
          .nav-bottom-bar .px-4 { padding: 6px 12px !important; }
        }
      `}</style>
    </div>
  )
}
