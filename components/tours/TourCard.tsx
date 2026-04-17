'use client'

import { Clock, Ruler, Mountain, Bike, Eye, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import clsx from 'clsx'
import type { Tour, Difficulty } from '@/lib/tours-data'

interface Props {
  tour: Tour
  locale: 'de' | 'en'
  onView: (tour: Tour) => void
  onBook: (tour: Tour) => void
}

const DIFFICULTY: Record<Difficulty, { de: string; en: string; color: string }> = {
  easy:     { de: 'Leicht',  en: 'Easy',     color: 'bg-green-100 text-green-700' },
  moderate: { de: 'Mittel',  en: 'Moderate', color: 'bg-yellow-100 text-yellow-700' },
  hard:     { de: 'Schwer',  en: 'Hard',     color: 'bg-red-100 text-red-700' },
}

function formatDuration(minutes: number, de: boolean) {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}min` : `${h}h`
}

export default function TourCard({ tour, locale, onView, onBook }: Props) {
  const de = locale === 'de'
  const diff = DIFFICULTY[tour.difficulty]

  return (
    <article className="card flex flex-col overflow-hidden group">
      {/* Colored top bar */}
      <div className="h-1.5" style={{ backgroundColor: tour.color }} />

      <div className="p-5 flex flex-col flex-1">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          <span className={clsx('text-[11px] font-bold px-2.5 py-0.5 rounded-full', diff.color)}>
            {de ? diff.de : diff.en}
          </span>
          {tour.isFamilyFriendly && (
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
              {de ? 'Familienfreundlich' : 'Family Friendly'}
            </span>
          )}
          {tour.isPopular && (
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-brand-red/10 text-brand-red">
              {de ? 'Beliebt' : 'Popular'}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-brand-black mb-2 leading-snug">
          {de ? tour.title.de : tour.title.en}
        </h3>

        {/* Description */}
        <p className="text-sm text-brand-gray mb-4 line-clamp-2 leading-relaxed flex-1">
          {de ? tour.description.de : tour.description.en}
        </p>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-brand-muted rounded-xl">
          <div className="flex flex-col items-center text-center gap-1">
            <Ruler size={13} className="text-brand-red" />
            <span className="text-sm font-bold text-brand-black leading-none">{tour.distance}&thinsp;km</span>
            <span className="text-[10px] text-brand-gray">{de ? 'Distanz' : 'Distance'}</span>
          </div>
          <div className="flex flex-col items-center text-center gap-1">
            <Clock size={13} className="text-brand-red" />
            <span className="text-sm font-bold text-brand-black leading-none">
              {formatDuration(tour.duration, de)}
            </span>
            <span className="text-[10px] text-brand-gray">{de ? 'Dauer' : 'Duration'}</span>
          </div>
          <div className="flex flex-col items-center text-center gap-1">
            <Mountain size={13} className="text-brand-red" />
            <span className="text-sm font-bold text-brand-black leading-none">
              {de ? diff.de : diff.en}
            </span>
            <span className="text-[10px] text-brand-gray">{de ? 'Niveau' : 'Level'}</span>
          </div>
        </div>

        {/* Recommended bike */}
        <div className="flex items-center gap-2 mb-5 px-3 py-2 border border-gray-100 rounded-lg bg-white">
          <Bike size={13} className="text-brand-red flex-shrink-0" />
          <span className="text-xs text-brand-gray">{de ? 'Empfohlen:' : 'Recommended:'}</span>
          <span className="text-xs font-semibold text-brand-black">
            {de ? tour.recommendedBike.de : tour.recommendedBike.en}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => onView(tour)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg border-2 border-brand-black text-brand-black text-xs font-bold hover:bg-brand-black hover:text-white transition-colors min-h-[44px]"
          >
            <Eye size={13} />
            {de ? 'Route' : 'Route'}
          </button>
          <button
            onClick={() => onBook(tour)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-brand-red text-white text-xs font-bold hover:bg-brand-red-dark transition-colors min-h-[44px]"
          >
            <ShoppingCart size={13} />
            {de ? 'Rad buchen' : 'Book Bike'}
          </button>
        </div>
      </div>
    </article>
  )
}
