'use client'

import Link from 'next/link'
import { ArrowRight, Star, Shield, RotateCcw, Users, Bike, Instagram, Facebook } from 'lucide-react'
import { useLocale } from '@/components/LocaleProvider'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { OpeningHours } from '@/lib/data-server'
import OpeningHoursWidget from '@/components/OpeningHoursWidget'
import { optimizeImageUrl } from '@/lib/image-utils'

type HeroImage = { id?: string; desktop: string; mobile?: string }

const FALLBACK_IMAGES: HeroImage[] = [
  { desktop: '/hero/hero-1.jpg',  mobile: '/hero/hero-1-mobile.jpg'  },
  { desktop: '/hero/hero-2.jpg',  mobile: '/hero/hero-2-mobile.jpg'  },
  { desktop: '/hero/hero-3.jpg',  mobile: '/hero/hero-3-mobile.jpg'  },
  { desktop: '/hero/hero-4.jpg',  mobile: '/hero/hero-4-mobile.jpg'  },
  { desktop: '/hero/hero-5.jpg',  mobile: '/hero/hero-5-mobile.jpg'  },
  { desktop: '/hero/hero-6.jpg',  mobile: '/hero/hero-6-mobile.jpg'  },
  { desktop: '/hero/hero-7.jpg',  mobile: '/hero/hero-7-mobile.jpg'  },
  { desktop: '/hero/hero-8.jpg',  mobile: '/hero/hero-8-mobile.jpg'  },
  { desktop: '/hero/hero-9.jpg',  mobile: '/hero/hero-9-mobile.jpg'  },
  { desktop: '/hero/hero-10.jpg', mobile: '/hero/hero-10-mobile.jpg' },
  { desktop: '/hero/hero-11.jpg', mobile: '/hero/hero-11-mobile.jpg' },
  { desktop: '/hero/hero-12.jpg', mobile: '/hero/hero-12-mobile.jpg' },
  { desktop: '/hero/hero-13.jpg' },
  { desktop: '/hero/hero-14.jpg' },
]

export default function Hero({ images, openingHours }: { images?: HeroImage[]; openingHours?: OpeningHours }) {
  const { t }      = useLocale()
  const sectionRef = useRef<HTMLDivElement>(null)
  const rafRef     = useRef<number>(0)
  const touchX     = useRef<number | null>(null)
  const mouseTarget = useRef({ x: 0, y: 0 })

  const [current,      setCurrent]      = useState(0)
  const [mouse,        setMouse]        = useState({ x: 0, y: 0 })
  const [scrollY,      setScrollY]      = useState(0)
  const [isDesktop,    setIsDesktop]    = useState(false)
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())

  const ALL_IMAGES = useMemo(
    () => (images && images.length > 0) ? images : FALLBACK_IMAGES,
    [images]
  )
  // Desktop: all images. Mobile: prefer images with a mobile version, fall back to all if none have one
  const HERO_IMAGES = useMemo(() => {
    if (isDesktop) return ALL_IMAGES
    const withMobile = ALL_IMAGES.filter(img => img.mobile)
    return withMobile.length > 0 ? withMobile : ALL_IMAGES
  }, [ALL_IMAGES, isDesktop])

  // Detect pointer device (desktop) — only enable mouse parallax on non-touch
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    setIsDesktop(mq.matches)
    const h = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener('change', h)
    return () => mq.removeEventListener('change', h)
  }, [])

  // Preload all hero images and mark them ready so they fade in instead of popping
  useEffect(() => {
    if (HERO_IMAGES.length === 0) return
    HERO_IMAGES.forEach((img, i) => {
      const src = isDesktop ? img.desktop : (img.mobile ?? img.desktop)
      const el = new window.Image()
      el.src = src
      if (el.complete) {
        setLoadedImages(prev => new Set([...prev, i]))
      } else {
        el.onload = () => setLoadedImages(prev => new Set([...prev, i]))
      }
    })
  }, [HERO_IMAGES, isDesktop])

  // Slideshow
  useEffect(() => {
    if (HERO_IMAGES.length === 0) return
    const id = setInterval(() => setCurrent(c => (c + 1) % HERO_IMAGES.length), 5000)
    return () => clearInterval(id)
  }, [HERO_IMAGES.length])

  // Brightness detection — sample top portion of current image, tell navbar
  useEffect(() => {
    if (!HERO_IMAGES[current]) return
    const src = isDesktop ? HERO_IMAGES[current].desktop : (HERO_IMAGES[current].mobile ?? HERO_IMAGES[current].desktop)
    const img = new window.Image()
    img.src = src
    img.onload = () => {
      try {
        const W = 100, H = 60
        const canvas = document.createElement('canvas')
        canvas.width = W; canvas.height = H
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        // Sample only the top 15% of the image (where the navbar sits)
        ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight * 0.15, 0, 0, W, H)
        const pixels = ctx.getImageData(0, 0, W, H).data
        let sum = 0
        for (let i = 0; i < pixels.length; i += 4) {
          sum += pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114
        }
        const brightness = sum / (pixels.length / 4) // 0 (black) → 255 (white)
        window.dispatchEvent(new CustomEvent('hero-brightness', { detail: brightness }))
      } catch { /* canvas tainted — ignore */ }
    }
  }, [current, isDesktop])

  // Scroll parallax (desktop only — on mobile parallax causes image to shift off screen)
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Mouse parallax — smooth lerp, desktop only
  useEffect(() => {
    if (!isDesktop) return

    function lerp(a: number, b: number, t: number) { return a + (b - a) * t }
    function tick() {
      setMouse(prev => {
        const nx = lerp(prev.x, mouseTarget.current.x, 0.06)
        const ny = lerp(prev.y, mouseTarget.current.y, 0.06)
        if (Math.abs(nx - prev.x) < 0.001 && Math.abs(ny - prev.y) < 0.001) return prev
        return { x: nx, y: ny }
      })
      rafRef.current = requestAnimationFrame(tick)
    }
    function onMouseMove(e: MouseEvent) {
      const el = sectionRef.current
      if (!el) return
      const { left, top, width, height } = el.getBoundingClientRect()
      mouseTarget.current = {
        x: ((e.clientX - left) / width  - 0.5) * 2,
        y: ((e.clientY - top)  / height - 0.5) * 2,
      }
    }
    rafRef.current = requestAnimationFrame(tick)
    window.addEventListener('mousemove', onMouseMove)
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [isDesktop])

  // Touch swipe (mobile)
  function onTouchStart(e: React.TouchEvent) {
    touchX.current = e.touches[0].clientX
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchX.current === null) return
    const diff = touchX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      setCurrent(c => diff > 0
        ? (c + 1) % HERO_IMAGES.length
        : (c - 1 + HERO_IMAGES.length) % HERO_IMAGES.length
      )
    }
    touchX.current = null
  }

  // Desktop parallax offsets
  const bgX = isDesktop ? mouse.x * -18 : 0
  const bgY = isDesktop ? mouse.y * -10 + scrollY * 0.45 : 0
  const txX = isDesktop ? mouse.x * 6  : 0
  const txY = isDesktop ? mouse.y * 4  : 0

  const trustItems = [
    { icon: <Star      size={18} className="fill-yellow-400 text-yellow-400 flex-shrink-0" />, label: t('trustBar.rating'), sub: t('trustBar.ratingSub') },
    { icon: <Shield    size={18} className="text-green-400 flex-shrink-0"                   />, label: t('trustBar.secure'), sub: t('trustBar.secureSub') },
    { icon: <RotateCcw size={18} className="text-blue-400 flex-shrink-0"                   />, label: t('trustBar.cancel'), sub: t('trustBar.cancelSub') },
    { icon: <Users     size={18} className="text-brand-red flex-shrink-0"                   />, label: t('trustBar.local'),  sub: t('trustBar.localSub')  },
    { icon: <Bike      size={18} className="text-white flex-shrink-0"                       />, label: t('trustBar.bikes'),  sub: t('trustBar.bikesSub')  },
  ]

  return (
    <section
      ref={sectionRef}
      id="hero-section"
      className="relative flex flex-col overflow-hidden bg-brand-black min-h-[85dvh] md:min-h-[100dvh]"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >

      {/* ── Placeholder gradient — visible while images load ─────────── */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 z-0" />

      {/* ── Background slides ─────────────────────────────────────────── */}
      {HERO_IMAGES.map((img, i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{
            opacity: i === current && loadedImages.has(i) ? 1 : 0,
            transition: 'opacity 1.2s ease',
            zIndex: 0,
          }}
        >
          {/* Mobile portrait image — falls back to desktop if no mobile version */}
          <div
            className="md:hidden absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${optimizeImageUrl(img.mobile ?? img.desktop, { width: 750, quality: 85 })}')` }}
          />
          {/* Desktop / tablet landscape image — with mouse parallax bleed */}
          <div
            className="hidden md:block absolute bg-cover bg-center"
            style={{
              inset: '-50px',
              backgroundImage: `url('${optimizeImageUrl(img.desktop, { width: 1920, quality: 85 })}')`,
              transform: `translateX(${bgX}px) translateY(${bgY}px)`,
              willChange: 'transform',
            }}
          />
        </div>
      ))}

      {/* ── Overlays ──────────────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-black/10 z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-black/5 to-transparent z-[1]" />
      {/* Top gradient — always dark so navbar text is always readable */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/35 to-transparent z-[1]" />

      {/* ── Main content ──────────────────────────────────────────────── */}
      <div
        className="relative z-10 flex-none md:flex-1 flex items-start md:items-center"
        style={{ transform: `translateX(${txX}px) translateY(${txY}px)` }}
      >
        <div className="w-full px-6 sm:px-8 lg:px-10 xl:px-14 mt-2 pt-6 pb-4 sm:mt-0 sm:py-28 md:py-32 lg:-mt-12 lg:py-36 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">

          {/* Left — hero text */}
          <div className="max-w-xl lg:max-w-2xl">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm rounded-full px-3 py-1 sm:px-4 sm:py-1.5 mb-5 sm:mb-7">
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <span className="text-white text-xs sm:text-sm font-semibold">{t('hero.badge')}</span>
            </div>

            {/* Headline — scales from small phones to 4K */}
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.02] mb-4 sm:mb-6 tracking-tight">
              {t('hero.title1')}<br />
              <span className="text-brand-red">{t('hero.title2')}</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/80 mb-7 sm:mb-10 max-w-md lg:max-w-lg leading-relaxed">
              {t('hero.subtitle')}
            </p>

            {/* CTAs — desktop only here */}
            <div className="hidden lg:flex flex-row gap-3 flex-wrap">
              <Link
                href="/bikes"
                className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-red-dark text-white font-bold rounded-xl px-5 sm:px-7 py-2.5 sm:py-3 text-sm sm:text-base transition-all duration-200 shadow-xl shadow-brand-red/30 hover:scale-[1.02]"
              >
                {t('hero.browseBikes')}
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-sm text-white font-bold rounded-xl px-5 sm:px-7 py-2.5 sm:py-3 text-sm sm:text-base transition-all duration-200"
              >
                {t('hero.howItWorks')}
              </Link>
            </div>

          </div>

          {/* Right — Opening hours panel (desktop only in flex flow) */}
          {openingHours && (
            <div className="hidden lg:block">
              <OpeningHoursWidget hours={openingHours} />
            </div>
          )}

        </div>
      </div>

      {/* ── Mobile CTAs + opening hours + dots — pinned to bottom ───── */}
      <div className="md:hidden mt-auto relative z-10 flex flex-col items-center gap-2 px-4 pb-4">
        <div className="flex flex-row gap-3 justify-center w-full">
          <Link
            href="/bikes"
            className="inline-flex items-center gap-2 bg-brand-red text-white font-bold rounded-xl px-5 py-2.5 text-sm transition-all duration-200 shadow-xl shadow-brand-red/30"
          >
            {t('hero.browseBikes')}
            <ArrowRight size={15} />
          </Link>
          <Link
            href="/how-it-works"
            className="inline-flex items-center gap-2 bg-white/10 border border-white/30 backdrop-blur-sm text-white font-bold rounded-xl px-5 py-2.5 text-sm transition-all duration-200"
          >
            {t('hero.howItWorks')}
          </Link>
        </div>

        {openingHours && (
          <div className="flex justify-center w-full">
            <OpeningHoursWidget hours={openingHours} />
          </div>
        )}

        <div className="flex justify-center gap-2">
          {HERO_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'bg-white w-6' : 'bg-white/40 w-1.5'}`}
            />
          ))}
        </div>
      </div>

      {/* ── Desktop swipe dots ────────────────────────────────────────── */}
      <div className="hidden md:flex relative z-10 justify-center gap-2 pb-4">
        {HERO_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'bg-white w-6' : 'bg-white/40 w-1.5'}`}
          />
        ))}
      </div>

      {/* ── Trust bar ─────────────────────────────────────────────────── */}
      <div className="relative z-10 border-t border-white/10 bg-black/50 backdrop-blur-md">
        <div className="container-site py-2 sm:py-3 md:py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="grid grid-cols-6 md:flex md:items-center md:justify-start gap-x-4 gap-y-3 sm:gap-y-3 md:gap-4 flex-1">
              {trustItems.map((item, i) => (
                <div key={item.label} className={`flex items-center gap-1.5 sm:gap-2.5 ${i < 3 ? 'col-span-2' : 'col-span-3'}`}>
                  {item.icon}
                  <div className="min-w-0">
                    <div className="text-white text-[10px] sm:text-xs md:text-sm font-semibold leading-tight">{item.label}</div>
                    <div className="text-white/55 text-[9px] sm:text-[10px] md:text-xs hidden xs:block">{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social buttons */}
            <div className="flex items-center gap-2 flex-shrink-0 pl-3 border-l border-white/15">
              <a
                href="https://www.instagram.com/drahtesel_ney"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-white/10 hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 border border-white/20 hover:border-transparent text-white px-2 py-1.5 md:px-3 rounded-lg text-xs font-semibold transition-all duration-300"
              >
                <Instagram size={13} />
                <span className="hidden md:inline">Instagram</span>
              </a>
              <a
                href="https://www.facebook.com/share/18hf7CXx87/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-white/10 hover:bg-[#1877f2] border border-white/20 hover:border-[#1877f2] text-white px-2 py-1.5 md:px-3 rounded-lg text-xs font-semibold transition-all duration-300"
              >
                <Facebook size={13} />
                <span className="hidden md:inline">Facebook</span>
              </a>
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}
