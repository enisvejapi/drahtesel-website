'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  Bike, Clock, MapPin, ChevronRight, Navigation2,
  CheckCircle2, Zap, Star, ArrowRight,
} from 'lucide-react'
import clsx from 'clsx'
import type { Tour } from '@/lib/tours-data'
import type { AppMode } from './FullMap'

interface Props {
  mode: AppMode
  tours: Tour[]
  selectedTour: Tour | null
  activeStopIdx: number
  locale: 'de' | 'en'
  onTourSelect: (tour: Tour) => void
  onStopChange: (idx: number) => void
  onStartRide: () => void
}

type SnapState = 'peek' | 'half' | 'full'

const DIFFICULTY_LABEL: Record<string, { de: string; en: string; color: string }> = {
  easy:     { de: 'Leicht',    en: 'Easy',     color: '#16a34a' },
  moderate: { de: 'Mittel',    en: 'Moderate', color: '#d97706' },
  hard:     { de: 'Schwer',    en: 'Hard',     color: '#dc2626' },
}

const BIKE_ICON: Record<string, string> = {
  city: '🚲', ebike: '⚡', family: '👨‍👩‍👧', trekking: '🏔️',
}

export default function TourListSheet({
  mode, tours, selectedTour, activeStopIdx, locale,
  onTourSelect, onStopChange, onStartRide,
}: Props) {
  const [snap, setSnap] = useState<SnapState>('peek')
  const [liveHeight, setLiveHeight] = useState<number | null>(null)
  const isDragging = useRef(false)
  const startY = useRef(0)
  const startH = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const de = locale === 'de'

  // Snap pixel heights (computed on mount / resize)
  const peekH  = 100
  const halfH  = useRef(360)
  const fullH  = useRef(680)

  useEffect(() => {
    const update = () => {
      halfH.current = Math.round(window.innerHeight * 0.46)
      fullH.current  = Math.round(window.innerHeight * 0.86)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Auto-snap when tour selected/deselected
  useEffect(() => {
    if (selectedTour) setSnap('half')
    else setSnap('peek')
    setLiveHeight(null)
  }, [selectedTour])

  // Scroll carousel to active stop
  useEffect(() => {
    if (!carouselRef.current || !selectedTour) return
    const card = carouselRef.current.children[activeStopIdx] as HTMLElement | undefined
    card?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
  }, [activeStopIdx, selectedTour])

  const snapToHeight = useCallback((h: number) => {
    const mid1 = (peekH + halfH.current) / 2
    const mid2 = (halfH.current + fullH.current) / 2
    if (h < mid1)        setSnap('peek')
    else if (h < mid2)   setSnap('half')
    else                 setSnap('full')
    setLiveHeight(null)
  }, [peekH])

  // Touch drag
  function onTouchStart(e: React.TouchEvent) {
    isDragging.current = true
    startY.current = e.touches[0].clientY
    startH.current = liveHeight ?? snapH(snap)
    containerRef.current!.style.transition = 'none'
  }
  function onTouchMove(e: React.TouchEvent) {
    if (!isDragging.current) return
    const dy = startY.current - e.touches[0].clientY
    const next = Math.max(peekH, Math.min(fullH.current, startH.current + dy))
    setLiveHeight(next)
  }
  function onTouchEnd() {
    isDragging.current = false
    containerRef.current!.style.transition = ''
    snapToHeight(liveHeight ?? snapH(snap))
  }

  function snapH(s: SnapState) {
    if (s === 'peek') return peekH
    if (s === 'half') return halfH.current
    return fullH.current
  }

  const currentH = liveHeight ?? snapH(snap)

  return (
    <div
      ref={containerRef}
      className="absolute bottom-20 md:bottom-0 left-0 right-0 z-[1050] bg-white rounded-t-3xl shadow-[0_-8px_40px_rgba(0,0,0,0.18)] overflow-hidden flex flex-col"
      style={{
        height: `${currentH}px`,
        transition: 'height 0.32s cubic-bezier(0.32,0.72,0,1)',
      }}
    >
      {/* ── Drag handle ──────────────────────────────────────────────────── */}
      <div
        className="flex-shrink-0 flex flex-col items-center pt-3 pb-2 cursor-grab active:cursor-grabbing touch-none select-none"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="w-10 h-1 bg-gray-200 rounded-full" />
      </div>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        {mode === 'browse' || !selectedTour
          ? <BrowseView tours={tours} locale={locale} onTourSelect={onTourSelect} snap={snap} />
          : <TourView
              tour={selectedTour}
              activeStopIdx={activeStopIdx}
              locale={locale}
              de={de}
              carouselRef={carouselRef}
              onStopChange={onStopChange}
              onStartRide={onStartRide}
              snap={snap}
            />
        }
      </div>
    </div>
  )
}

// ─── Browse: list of all tours ───────────────────────────────────────────────
function BrowseView({ tours, locale, onTourSelect, snap }: {
  tours: Tour[]
  locale: 'de' | 'en'
  onTourSelect: (tour: Tour) => void
  snap: SnapState
}) {
  const de = locale === 'de'
  return (
    <div className="px-4 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-[15px] font-extrabold text-brand-black">
            {de ? 'Touren auf Norderney' : 'Tours on Norderney'}
          </h2>
          <p className="text-[11px] text-brand-gray mt-0.5">
            {de ? '6 kuratierte Radrouten' : '6 curated bike routes'}
          </p>
        </div>
        <span className="bg-brand-red/10 text-brand-red text-[11px] font-bold px-2.5 py-1 rounded-full">6</span>
      </div>

      {/* Tour cards */}
      <div className={clsx(
        'grid gap-3',
        snap === 'full' ? 'grid-cols-1' : 'grid-cols-1'
      )}>
        {tours.map(tour => (
          <TourListCard key={tour.id} tour={tour} locale={locale} onSelect={onTourSelect} />
        ))}
      </div>
    </div>
  )
}

function TourListCard({ tour, locale, onSelect }: {
  tour: Tour
  locale: 'de' | 'en'
  onSelect: (tour: Tour) => void
}) {
  const de = locale === 'de'
  const diff = DIFFICULTY_LABEL[tour.difficulty]
  return (
    <button
      onClick={() => onSelect(tour)}
      className="w-full text-left bg-gray-50 hover:bg-gray-100 active:scale-[0.99] rounded-2xl overflow-hidden transition-all border border-gray-100"
    >
      <div className="flex items-stretch">
        {/* Color bar */}
        <div className="w-1.5 flex-shrink-0 rounded-l-2xl" style={{ backgroundColor: tour.color }} />

        <div className="flex-1 px-3.5 py-3">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: tour.color }}>
                {BIKE_ICON[tour.recommendedBikeType]} {de ? tour.recommendedBike.de : tour.recommendedBike.en}
              </span>
              <h3 className="text-sm font-extrabold text-brand-black leading-tight">
                {de ? tour.title.de : tour.title.en}
              </h3>
            </div>
            <ChevronRight size={16} className="text-gray-300 flex-shrink-0 mt-1" />
          </div>

          <p className="text-[11px] text-brand-gray leading-relaxed line-clamp-2 mb-2.5">
            {de ? tour.description.de : tour.description.en}
          </p>

          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1 text-[11px] text-brand-gray">
              <MapPin size={11} className="text-brand-red" />
              {tour.distance} km
            </span>
            <span className="flex items-center gap-1 text-[11px] text-brand-gray">
              <Clock size={11} />
              {tour.duration} min
            </span>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
              style={{ backgroundColor: diff.color }}
            >
              {de ? diff.de : diff.en}
            </span>
            {tour.isFamilyFriendly && (
              <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                {de ? '👨‍👩‍👧 Familie' : '👨‍👩‍👧 Family'}
              </span>
            )}
            {tour.isPopular && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                <Star size={9} />
                {de ? 'Beliebt' : 'Popular'}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  )
}

// ─── Tour: detail view with stop carousel ───────────────────────────────────
function TourView({ tour, activeStopIdx, locale, de, carouselRef, onStopChange, onStartRide, snap }: {
  tour: Tour
  activeStopIdx: number
  locale: 'de' | 'en'
  de: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  carouselRef: React.RefObject<any>
  onStopChange: (idx: number) => void
  onStartRide: () => void
  snap: SnapState
}) {
  const diff = DIFFICULTY_LABEL[tour.difficulty]

  return (
    <div className="pb-6">
      {/* Tour header */}
      <div className="px-4 pb-3">
        {/* Color pill + title */}
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: tour.color }} />
          <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: tour.color }}>
            {BIKE_ICON[tour.recommendedBikeType]} {de ? tour.recommendedBike.de : tour.recommendedBike.en}
          </span>
        </div>
        <h2 className="text-xl font-extrabold text-brand-black leading-tight mb-1">
          {de ? tour.title.de : tour.title.en}
        </h2>
        <p className="text-sm text-brand-gray leading-relaxed line-clamp-2">
          {de ? tour.description.de : tour.description.en}
        </p>

        {/* Stats row */}
        <div className="flex items-center gap-4 mt-3 pb-3 border-b border-gray-100">
          <StatPill icon={<MapPin size={12} />} value={`${tour.distance} km`} />
          <StatPill icon={<Clock size={12} />} value={`${tour.duration} min`} />
          <span
            className="text-[11px] font-bold px-2.5 py-1 rounded-full text-white"
            style={{ backgroundColor: diff.color }}
          >
            {de ? diff.de : diff.en}
          </span>
          {tour.isScenic && (
            <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full">
              {de ? '🌅 Landschaft' : '🌅 Scenic'}
            </span>
          )}
        </div>
      </div>

      {/* Stop carousel */}
      <div className="mb-3">
        <div className="px-4 mb-2 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-widest text-brand-gray">
            {de ? `${tour.stops.length} Stationen` : `${tour.stops.length} Stops`}
          </span>
          <span className="text-[11px] text-brand-gray">
            {activeStopIdx + 1} / {tour.stops.length}
          </span>
        </div>

        <div
          ref={carouselRef}
          className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pl-4 pr-4 pb-1"
        >
          {tour.stops.map((stop, idx) => {
            const active = idx === activeStopIdx
            return (
              <button
                key={stop.id}
                onClick={() => onStopChange(idx)}
                className={clsx(
                  'flex-shrink-0 snap-start w-[220px] rounded-2xl border-2 p-3.5 text-left transition-all',
                  active
                    ? 'shadow-lg'
                    : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                )}
                style={active ? {
                  borderColor: tour.color,
                  backgroundColor: `${tour.color}0d`,
                } : {}}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className="w-6 h-6 rounded-full text-white text-[11px] font-black flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: active ? tour.color : '#9ca3af' }}
                  >
                    {idx + 1}
                  </span>
                  <span
                    className="text-[10px] font-bold uppercase tracking-wide truncate"
                    style={{ color: active ? tour.color : '#9ca3af' }}
                  >
                    {de ? stop.label.de : stop.label.en}
                  </span>
                  {active && <CheckCircle2 size={13} className="ml-auto flex-shrink-0" style={{ color: tour.color }} />}
                </div>
                <div className="text-[13px] font-extrabold text-brand-black truncate">
                  {de ? stop.title.de : stop.title.en}
                </div>
                <div className="text-[11px] text-brand-gray mt-0.5 line-clamp-2 leading-relaxed">
                  {de ? stop.description.de : stop.description.en}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Full description (only in full snap) */}
      {snap === 'full' && (
        <div className="px-4 mb-4">
          <p className="text-[13px] text-brand-gray leading-relaxed">
            {de ? tour.longDescription.de : tour.longDescription.en}
          </p>
          {tour.highlights[de ? 'de' : 'en'].length > 0 && (
            <div className="mt-3">
              <p className="text-[11px] font-bold uppercase tracking-widest text-brand-gray mb-2">
                {de ? 'Highlights' : 'Highlights'}
              </p>
              <div className="flex flex-wrap gap-2">
                {tour.highlights[de ? 'de' : 'en'].map((h) => (
                  <span key={h} className="text-[11px] font-semibold bg-gray-100 text-brand-gray px-2.5 py-1 rounded-full">
                    {h}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* CTAs */}
      <div className="px-4 flex flex-col gap-2.5">
        {/* Start Ride */}
        <button
          onClick={onStartRide}
          className="w-full flex items-center justify-center gap-2.5 text-white text-sm font-extrabold py-3.5 rounded-2xl min-h-[52px] transition-all active:scale-[0.98] shadow-lg"
          style={{ backgroundColor: tour.color, boxShadow: `0 8px 24px ${tour.color}40` }}
        >
          <Navigation2 size={18} />
          {de ? 'Tour starten' : 'Start Ride'}
          <Zap size={15} />
        </button>

        {/* Book Bike */}
        <Link
          href="/bikes"
          className="w-full flex items-center justify-center gap-2 bg-brand-black text-white text-sm font-bold py-3.5 rounded-2xl min-h-[52px] hover:bg-[#111] transition-colors active:scale-[0.98]"
        >
          <Bike size={16} />
          {de ? `${BIKE_ICON[tour.recommendedBikeType]} ${tour.recommendedBike.de} buchen` : `${BIKE_ICON[tour.recommendedBikeType]} Book ${tour.recommendedBike.en}`}
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  )
}

function StatPill({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <span className="flex items-center gap-1 text-[12px] font-semibold text-brand-gray">
      <span className="text-brand-red">{icon}</span>
      {value}
    </span>
  )
}
