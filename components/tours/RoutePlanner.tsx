'use client'

import { useState } from 'react'
import {
  MapPin, Navigation, Bike, Mountain, Clock, Ruler,
  ChevronRight, CheckCircle,
} from 'lucide-react'
import Link from 'next/link'
import clsx from 'clsx'
import type { Tour } from '@/lib/tours-data'
import { TOURS, NORDERNEY_LOCATIONS } from '@/lib/tours-data'

interface Props {
  locale: 'de' | 'en'
  onTourSelected: (tour: Tour) => void
}

type BikeFilter = 'any' | 'city' | 'ebike' | 'family' | 'trekking'

interface FormState {
  start: string
  destination: string
  bikeType: BikeFilter
  scenic: boolean
  familyFriendly: boolean
  avoidSand: boolean
}

const DIFF_LABEL = {
  easy:     { de: 'Leicht',  en: 'Easy' },
  moderate: { de: 'Mittel',  en: 'Moderate' },
  hard:     { de: 'Schwer',  en: 'Hard' },
} as const

const BIKE_OPTIONS: { value: BikeFilter; de: string; en: string }[] = [
  { value: 'any',      de: 'Egal (empfohlen)',    en: 'Any (recommended)' },
  { value: 'city',     de: 'Cityrad',             en: 'City Bike' },
  { value: 'ebike',    de: 'E-Bike',              en: 'E-Bike' },
  { value: 'family',   de: 'Familienrad',         en: 'Family Bike' },
  { value: 'trekking', de: 'Trekkingrad',         en: 'Trekking Bike' },
]

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer select-none">
      <span className="text-sm text-brand-gray leading-snug">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        role="switch"
        aria-checked={checked}
        className={clsx(
          'relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200',
          checked ? 'bg-brand-red' : 'bg-gray-200'
        )}
      >
        <span
          className={clsx(
            'absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200',
            checked ? 'left-6' : 'left-1'
          )}
        />
      </button>
    </label>
  )
}

function matchTour(form: FormState): Tour {
  let pool = [...TOURS]

  if (form.familyFriendly) {
    const f = pool.filter(t => t.isFamilyFriendly)
    if (f.length) pool = f
  }
  if (form.avoidSand) {
    const f = pool.filter(t => !t.hasBeach)
    if (f.length) pool = f
  }
  if (form.scenic) {
    const f = pool.filter(t => t.isScenic)
    if (f.length) pool = f
  }
  if (form.bikeType !== 'any') {
    const f = pool.filter(t => t.recommendedBikeType === form.bikeType)
    if (f.length) pool = f
  }

  // Prefer destination match by id
  const destMatch = pool.find(t => t.id === form.destination || t.slug.includes(form.destination))
  if (destMatch) return destMatch

  return pool.find(t => t.isPopular) ?? pool[0]
}

export default function RoutePlanner({ locale, onTourSelected }: Props) {
  const de = locale === 'de'

  const [form, setForm] = useState<FormState>({
    start: 'shop',
    destination: 'weststrand',
    bikeType: 'any',
    scenic: false,
    familyFriendly: false,
    avoidSand: false,
  })
  const [result, setResult] = useState<Tour | null>(null)
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // Simulate routing latency
    setTimeout(() => {
      const tour = matchTour(form)
      setResult(tour)
      onTourSelected(tour)
      setLoading(false)
    }, 700)
  }

  const selectClass =
    'w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-brand-black bg-white ' +
    'focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red appearance-none'

  return (
    <div className="space-y-4">
      {/* Form card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-card p-5 space-y-4"
      >
        <div className="flex items-center gap-2 mb-0.5">
          <Navigation size={17} className="text-brand-red" />
          <h3 className="text-base font-bold text-brand-black">
            {de ? 'Route planen' : 'Plan Your Route'}
          </h3>
        </div>

        {/* Start */}
        <div>
          <label className="block text-xs font-bold text-brand-black mb-1.5 uppercase tracking-wide">
            {de ? 'Startpunkt' : 'Starting Point'}
          </label>
          <div className="relative">
            <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-red pointer-events-none" />
            <select
              value={form.start}
              onChange={e => setForm(f => ({ ...f, start: e.target.value }))}
              className={selectClass}
            >
              {NORDERNEY_LOCATIONS.map(loc => (
                <option key={loc.id} value={loc.id}>
                  {de ? loc.label.de : loc.label.en}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Destination */}
        <div>
          <label className="block text-xs font-bold text-brand-black mb-1.5 uppercase tracking-wide">
            {de ? 'Ziel' : 'Destination'}
          </label>
          <div className="relative">
            <Navigation size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-red pointer-events-none" />
            <select
              value={form.destination}
              onChange={e => setForm(f => ({ ...f, destination: e.target.value }))}
              className={selectClass}
            >
              {NORDERNEY_LOCATIONS.filter(l => l.id !== form.start).map(loc => (
                <option key={loc.id} value={loc.id}>
                  {de ? loc.label.de : loc.label.en}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bike type */}
        <div>
          <label className="block text-xs font-bold text-brand-black mb-1.5 uppercase tracking-wide">
            {de ? 'Fahrradtyp' : 'Bike Type'}
          </label>
          <div className="relative">
            <Bike size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-red pointer-events-none" />
            <select
              value={form.bikeType}
              onChange={e => setForm(f => ({ ...f, bikeType: e.target.value as BikeFilter }))}
              className={selectClass}
            >
              {BIKE_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>
                  {de ? o.de : o.en}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-3.5 pt-1 border-t border-gray-100">
          <Toggle
            checked={form.scenic}
            onChange={v => setForm(f => ({ ...f, scenic: v }))}
            label={de ? 'Landschaftliche Route bevorzugen' : 'Prefer scenic route'}
          />
          <Toggle
            checked={form.familyFriendly}
            onChange={v => setForm(f => ({ ...f, familyFriendly: v }))}
            label={de ? 'Familienfreundlich' : 'Family friendly'}
          />
          <Toggle
            checked={form.avoidSand}
            onChange={v => setForm(f => ({ ...f, avoidSand: v }))}
            label={de ? 'Sandwege vermeiden' : 'Avoid sand paths'}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary justify-center py-3.5 text-sm font-bold min-h-[48px]"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              {de ? 'Berechne Route...' : 'Calculating...'}
            </>
          ) : (
            <>
              <Navigation size={15} />
              {de ? 'Route berechnen' : 'Calculate Route'}
              <ChevronRight size={15} />
            </>
          )}
        </button>
      </form>

      {/* Result card */}
      {result && (
        <div className="bg-white rounded-2xl shadow-card overflow-hidden border-2 border-brand-red/20">
          {/* Header */}
          <div className="bg-brand-red px-5 py-3 flex items-center gap-2">
            <CheckCircle size={15} className="text-white" />
            <span className="text-sm font-bold text-white">
              {de ? 'Empfohlene Route' : 'Recommended Route'}
            </span>
          </div>

          <div className="p-5">
            <h4 className="text-lg font-bold text-brand-black mb-1 leading-snug">
              {de ? result.title.de : result.title.en}
            </h4>
            <p className="text-sm text-brand-gray mb-4 leading-relaxed">
              {de ? result.description.de : result.description.en}
            </p>

            {/* Mini stats */}
            <div className="grid grid-cols-2 gap-2.5 mb-4">
              {[
                {
                  icon: Ruler,
                  value: `${result.distance} km`,
                  label: de ? 'Distanz' : 'Distance',
                },
                {
                  icon: Clock,
                  value: result.duration < 60
                    ? `${result.duration} min`
                    : `${Math.floor(result.duration / 60)}h${result.duration % 60 ? ` ${result.duration % 60}min` : ''}`,
                  label: de ? 'Dauer' : 'Duration',
                },
                {
                  icon: Mountain,
                  value: de ? DIFF_LABEL[result.difficulty].de : DIFF_LABEL[result.difficulty].en,
                  label: de ? 'Schwierigkeit' : 'Difficulty',
                },
                {
                  icon: Bike,
                  value: de ? result.recommendedBike.de : result.recommendedBike.en,
                  label: de ? 'Fahrrad' : 'Bike',
                },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-start gap-2 p-2.5 bg-brand-muted rounded-lg">
                  <Icon size={13} className="text-brand-red flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <div className="text-[10px] text-brand-gray uppercase tracking-wide">{label}</div>
                    <div className="text-sm font-semibold text-brand-black truncate">{value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={() => onTourSelected(result)}
                className="btn-secondary flex-1 justify-center text-sm py-2.5"
              >
                {de ? 'Auf Karte anzeigen' : 'Show on Map'}
              </button>
              <Link href="/bikes" className="btn-primary flex-1 justify-center text-sm py-2.5">
                {de ? 'Rad buchen' : 'Book Bike'}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
