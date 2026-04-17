'use client'

import { X, Clock, Bike, Navigation2 } from 'lucide-react'
import type { InterestPin } from '@/lib/interest-pins'
import { PIN_CATEGORIES } from '@/lib/interest-pins'
import type { ActiveRoute } from './ExploreMap'

interface Props {
  pin: InterestPin
  route: ActiveRoute
  locale: 'de' | 'en'
  onClear: () => void
  onStartNavigation: () => void
}

function fmtDist(m: number, de: boolean) {
  if (m < 1000) return `${Math.round(m / 10) * 10} m`
  return `${(m / 1000).toFixed(1)} km`
}

function fmtTime(s: number, de: boolean) {
  const min = Math.round(s / 60)
  if (min < 60) return de ? `${min} Min.` : `${min} min`
  const h = Math.floor(min / 60)
  const rem = min % 60
  return de ? `${h} Std. ${rem} Min.` : `${h}h ${rem}m`
}

export default function RouteBar({ pin, route, locale, onClear, onStartNavigation }: Props) {
  const de = locale === 'de'
  const cat = PIN_CATEGORIES[pin.category]

  return (
    <div className="absolute top-0 left-0 right-0 z-[1100] px-3 pointer-events-none"
      style={{ paddingTop: 'max(16px, env(safe-area-inset-top))' }}>
      <div className="pointer-events-auto bg-white/96 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden">
        {/* Color accent top bar */}
        <div className="h-1" style={{ backgroundColor: cat.color }} />

        <div className="flex items-center gap-3 px-4 py-3">
          {/* Category emoji */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ backgroundColor: `${cat.color}18` }}
          >
            {cat.emoji}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-extrabold text-gray-900 truncate">
              {de ? pin.title.de : pin.title.en}
            </div>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="flex items-center gap-1 text-[11px] font-semibold text-gray-500">
                <Bike size={11} />
                {fmtDist(route.distance, de)}
              </span>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-gray-500">
                <Clock size={11} />
                {fmtTime(route.duration, de)}
              </span>
            </div>
          </div>

          {/* Start navigation */}
          <button
            onClick={onStartNavigation}
            className="flex-shrink-0 flex items-center gap-1.5 text-white text-[12px] font-bold px-3 py-2 rounded-xl transition-colors"
            style={{ backgroundColor: cat.color }}
          >
            <Navigation2 size={14} />
            {de ? 'Los' : 'Go'}
          </button>

          {/* Close */}
          <button
            onClick={onClear}
            className="flex-shrink-0 p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
