'use client'

import { useEffect } from 'react'
import { X, Clock, Ruler, Mountain, Bike, MapPin, CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import clsx from 'clsx'
import type { Tour, Difficulty } from '@/lib/tours-data'
import { SHOP_ADDRESS, SHOP_HOURS } from '@/lib/tours-data'

interface Props {
  tour: Tour | null
  open: boolean
  onClose: () => void
  locale: 'de' | 'en'
}

const DIFFICULTY: Record<Difficulty, { de: string; en: string; textColor: string; bgColor: string }> = {
  easy:     { de: 'Leicht',  en: 'Easy',     textColor: 'text-green-700',  bgColor: 'bg-green-100'  },
  moderate: { de: 'Mittel',  en: 'Moderate', textColor: 'text-yellow-700', bgColor: 'bg-yellow-100' },
  hard:     { de: 'Schwer',  en: 'Hard',     textColor: 'text-red-700',    bgColor: 'bg-red-100'    },
}

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}min` : `${h}h`
}

export default function TourDrawer({ tour, open, onClose, locale }: Props) {
  const de = locale === 'de'

  // Lock body scroll when open on mobile
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  if (!tour) return null

  const diff = DIFFICULTY[tour.difficulty]

  const stats = [
    { icon: Ruler,    value: `${tour.distance} km`,         label: de ? 'Distanz' : 'Distance' },
    { icon: Clock,    value: formatDuration(tour.duration),  label: de ? 'Dauer' : 'Duration' },
    { icon: Mountain, value: de ? diff.de : diff.en,         label: de ? 'Schwierigkeit' : 'Difficulty' },
  ]

  return (
    <>
      {/* Backdrop */}
      <div
        className={clsx(
          'fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300',
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/*
        Mobile  → bottom sheet sliding up from bottom
        Desktop → centered modal
      */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={de ? tour.title.de : tour.title.en}
        className={clsx(
          'fixed z-[70] bg-white transition-all duration-300 ease-out',
          // Mobile geometry
          'bottom-0 left-0 right-0 rounded-t-2xl max-h-[88vh]',
          // Desktop overrides
          'md:bottom-auto md:left-1/2 md:right-auto md:-translate-x-1/2',
          'md:top-1/2 md:-translate-y-1/2',
          'md:w-full md:max-w-2xl md:rounded-2xl md:max-h-[90vh]',
          // Open / closed animation
          open
            ? 'translate-y-0 opacity-100 md:scale-100'
            : 'translate-y-full opacity-0 pointer-events-none md:translate-y-0 md:scale-95'
        )}
      >
        {/* Drag handle — mobile only */}
        <div className="md:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* Color accent bar */}
        <div className="h-1 mx-5 md:mx-0 md:rounded-none rounded-full" style={{ backgroundColor: tour.color }} />

        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex-1 pr-4">
            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
              <span className={clsx('text-[11px] font-bold px-2 py-0.5 rounded-full', diff.bgColor, diff.textColor)}>
                {de ? diff.de : diff.en}
              </span>
              {tour.isFamilyFriendly && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  {de ? 'Familienfreundlich' : 'Family Friendly'}
                </span>
              )}
            </div>
            <h2 className="text-xl font-extrabold text-brand-black leading-tight">
              {de ? tour.title.de : tour.title.en}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-2 rounded-xl hover:bg-gray-100 transition-colors text-brand-gray"
            aria-label={de ? 'Schließen' : 'Close'}
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto px-5 py-5 space-y-5" style={{ maxHeight: 'calc(88vh - 140px)' }}>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex flex-col items-center text-center p-3 bg-brand-muted rounded-xl">
                <Icon size={16} className="text-brand-red mb-1.5" />
                <span className="text-sm font-bold text-brand-black">{value}</span>
                <span className="text-[10px] text-brand-gray mt-0.5">{label}</span>
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-brand-black mb-2">
              {de ? 'Über diese Tour' : 'About this tour'}
            </h3>
            <p className="text-sm text-brand-gray leading-relaxed">
              {de ? tour.longDescription.de : tour.longDescription.en}
            </p>
          </div>

          {/* Terrain */}
          <div className="flex items-start gap-3 p-3 bg-brand-muted rounded-xl">
            <Mountain size={14} className="text-brand-red flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-semibold text-brand-black">{de ? 'Untergrund: ' : 'Terrain: '}</span>
              <span className="text-brand-gray">{de ? tour.terrain.de : tour.terrain.en}</span>
            </div>
          </div>

          {/* Recommended bike */}
          <div className="flex items-center gap-3 p-3 border-2 border-gray-100 rounded-xl bg-white">
            <div className="w-9 h-9 bg-brand-red/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Bike size={16} className="text-brand-red" />
            </div>
            <div>
              <div className="text-[11px] text-brand-gray font-medium">
                {de ? 'Empfohlenes Fahrrad' : 'Recommended bike'}
              </div>
              <div className="text-sm font-bold text-brand-black">
                {de ? tour.recommendedBike.de : tour.recommendedBike.en}
              </div>
            </div>
          </div>

          {/* Highlights */}
          <div>
            <h3 className="text-sm font-bold text-brand-black mb-3">Highlights</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(de ? tour.highlights.de : tour.highlights.en).map((h, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle size={13} className="text-brand-red flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-brand-gray">{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pickup info */}
          <div className="flex items-start gap-3 p-4 bg-brand-black rounded-xl">
            <MapPin size={15} className="text-brand-red flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-[11px] font-semibold text-white/60 mb-0.5">
                {de ? 'Abholung & Rückgabe' : 'Pickup & Return'}
              </div>
              <div className="text-sm font-semibold text-white">{SHOP_ADDRESS}</div>
              <div className="text-xs text-white/50 mt-0.5">
                {de ? SHOP_HOURS.de : SHOP_HOURS.en}
              </div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pb-1">
            <Link
              href="/bikes"
              onClick={onClose}
              className="btn-primary flex-1 justify-center py-3 text-sm"
            >
              {de
                ? `${tour.recommendedBike.de} buchen`
                : `Book ${tour.recommendedBike.en}`}
              <ArrowRight size={14} />
            </Link>
            <button
              onClick={onClose}
              className="btn-secondary flex-1 justify-center py-3 text-sm"
            >
              {de ? 'Schließen' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
