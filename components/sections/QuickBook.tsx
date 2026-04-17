'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, ChevronDown } from 'lucide-react'
import { useLocale } from '@/components/LocaleProvider'

const CATEGORIES_DE = ['Alle Fahrräder', 'E-Bike', 'Citybike', 'Kinderrad', 'Anhänger', 'E-Lastenrad', 'Elektromobil']
const CATEGORIES_EN = ['All Bikes', 'E-Bike', 'City Bike', 'Kids Bike', 'Trailer', 'E-Cargo', 'E-Mobil']

const DURATIONS_DE = ['Ganztag', '3 Tage', '1 Woche']
const DURATIONS_EN = ['Full Day', '3 Days', '1 Week']

const SLUG_MAP: Record<string, string> = {
  'E-Bike': 'e-bike',
  'Citybike': 'city-bike',
  'City Bike': 'city-bike',
  'Kinderrad': 'kinderrad',
  'Kids Bike': 'kinderrad',
  'Anhänger': 'anhaenger',
  'Trailer': 'anhaenger',
  'E-Lastenrad': 'e-lastenrad',
  'E-Cargo': 'e-lastenrad',
  'Elektromobil': 'e-mobil',
  'E-Mobil': 'e-mobil',
}

export default function QuickBook() {
  const { locale } = useLocale()
  const de = locale === 'de'
  const router = useRouter()

  const cats = de ? CATEGORIES_DE : CATEGORIES_EN
  const durs = de ? DURATIONS_DE : DURATIONS_EN

  const [cat, setCat] = useState(cats[0])
  const [dur, setDur] = useState(durs[0])

  function handleSearch() {
    const slug = SLUG_MAP[cat]
    router.push(slug ? `/bikes?category=${slug}` : '/bikes')
  }

  return (
    <div className="bg-brand-black border-b border-white/10">
      <div className="container-site py-5">
        <div className="grid grid-cols-2 sm:flex sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <span className="text-white/60 text-sm font-medium whitespace-nowrap hidden sm:block">
            {de ? 'Schnell buchen:' : 'Quick book:'}
          </span>

          {/* Category picker */}
          <div className="relative flex-1">
            <select
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              className="w-full appearance-none bg-white/10 hover:bg-white/15 border border-white/20 text-white rounded-lg px-4 py-2.5 text-sm font-medium pr-9 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-red/50 transition-colors"
            >
              {cats.map((c) => <option key={c} value={c} className="bg-brand-black">{c}</option>)}
            </select>
            <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" />
          </div>

          {/* Duration picker */}
          <div className="relative flex-1">
            <select
              value={dur}
              onChange={(e) => setDur(e.target.value)}
              className="w-full appearance-none bg-white/10 hover:bg-white/15 border border-white/20 text-white rounded-lg px-4 py-2.5 text-sm font-medium pr-9 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-red/50 transition-colors"
            >
              {durs.map((d) => <option key={d} value={d} className="bg-brand-black">{d}</option>)}
            </select>
            <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" />
          </div>

          {/* CTA */}
          <button
            onClick={handleSearch}
            className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-red-dark text-white font-bold rounded-lg px-6 py-2.5 text-sm transition-all duration-200 hover:scale-[1.02] flex-shrink-0"
          >
            <Search size={15} />
            {de ? 'Fahrrad finden' : 'Find a Bike'}
          </button>
        </div>
      </div>
    </div>
  )
}
