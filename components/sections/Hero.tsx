'use client'

import Link from 'next/link'
import { ArrowRight, Star, Shield, RotateCcw, MapPin, Users, Bike } from 'lucide-react'
import { useLocale } from '@/components/LocaleProvider'
import { useEffect, useState } from 'react'

const HERO_IMAGES = [
  '/hero/hero-1.jpg',
  '/hero/hero-2.jpg',
  '/hero/hero-3.avif',
]

export default function Hero() {
  const { t } = useLocale()
  const [current, setCurrent] = useState(0)
  const [prev, setPrev] = useState<number | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((c) => {
        setPrev(c)
        return (c + 1) % HERO_IMAGES.length
      })
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const trustItems = [
    { icon: <Star size={18} className="fill-yellow-400 text-yellow-400 flex-shrink-0" />, label: t('trustBar.rating'), sub: t('trustBar.ratingSub') },
    { icon: <Shield size={18} className="text-green-400 flex-shrink-0" />, label: t('trustBar.secure'), sub: t('trustBar.secureSub') },
    { icon: <RotateCcw size={18} className="text-blue-400 flex-shrink-0" />, label: t('trustBar.cancel'), sub: t('trustBar.cancelSub') },
    { icon: <Users size={18} className="text-brand-red flex-shrink-0" />, label: t('trustBar.local'), sub: t('trustBar.localSub') },
    { icon: <Bike size={18} className="text-white flex-shrink-0" />, label: t('trustBar.bikes'), sub: t('trustBar.bikesSub') },
  ]

  return (
    <section className="relative min-h-[90vh] flex flex-col overflow-hidden bg-brand-black">
      {/* Slideshow layers */}
      {HERO_IMAGES.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
          style={{
            backgroundImage: `url('${src}')`,
            filter: 'blur(1.5px) brightness(0.58)',
            transform: 'scale(1.04)',
            opacity: i === current ? 1 : 0,
          }}
        />
      ))}

      {/* Dark gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />

      {/* Main content */}
      <div className="relative flex-1 flex items-center container-site py-24 md:py-28">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-brand-red/20 border border-brand-red/30 rounded-full px-4 py-1.5 mb-6">
            <Star size={14} className="text-brand-red fill-brand-red" />
            <span className="text-brand-red text-sm font-semibold">{t('hero.badge')}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-4 md:mb-6 drop-shadow-lg">
            {t('hero.title1')}<br />
            <span className="text-brand-red">{t('hero.title2')}</span>
          </h1>

          <p className="text-base sm:text-lg md:text-2xl text-white/90 mb-7 md:mb-10 max-w-2xl leading-relaxed font-medium drop-shadow">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
            <Link href="/bikes" className="inline-flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-red-dark text-white font-bold rounded-xl px-8 py-4 text-base md:text-lg transition-all duration-200 shadow-lg hover:scale-[1.02]">
              {t('hero.browseBikes')}
              <ArrowRight size={20} />
            </Link>
            <Link href="/how-it-works" className="inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 border-2 border-white/40 text-white font-bold rounded-xl px-8 py-4 text-base md:text-lg transition-all duration-200 backdrop-blur-sm">
              {t('hero.howItWorks')}
            </Link>
          </div>
        </div>
      </div>

      {/* Trust bar — pinned inside hero at bottom */}
      <div className="relative z-10 border-t border-white/10 bg-black/40 backdrop-blur-md">
        <div className="container-site py-2.5 md:py-4">
          <div className="grid grid-cols-6 md:flex md:items-center md:justify-between gap-x-2 gap-y-2.5 md:gap-4">
            {trustItems.map((item, i) => (
              <div key={item.label} className={`flex items-center gap-2 ${i < 3 ? 'col-span-2' : 'col-span-3'}`}>
                {item.icon}
                <div className="min-w-0">
                  <div className="text-white text-xs md:text-sm font-semibold leading-tight">{item.label}</div>
                  <div className="text-white/60 text-[10px] md:text-xs">{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2">
        {HERO_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => { setPrev(current); setCurrent(i) }}
            className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'bg-white w-5' : 'bg-white/40 w-2'}`}
          />
        ))}
      </div>
    </section>
  )
}
