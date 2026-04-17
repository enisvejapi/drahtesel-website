'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { X, Navigation2, Loader2, Lightbulb, ChevronRight } from 'lucide-react'
import type { InterestPin } from '@/lib/interest-pins'
import { PIN_CATEGORIES } from '@/lib/interest-pins'

interface Props {
  pin: InterestPin
  locale: 'de' | 'en'
  routeLoading: boolean
  hasRoute: boolean
  onGetRoute: () => void
  onClose: () => void
}

type Snap = 'peek' | 'half' | 'full'

export default function PinSheet({ pin, locale, routeLoading, hasRoute, onGetRoute, onClose }: Props) {
  const de = locale === 'de'
  const cat = PIN_CATEGORIES[pin.category]
  const [snap, setSnap] = useState<Snap>('half')
  const [liveH, setLiveH] = useState<number | null>(null)
  const [lightboxImg, setLightboxImg] = useState<string | null>(null)
  const isDragging = useRef(false)
  const startY = useRef(0)
  const startH = useRef(0)
  const ref = useRef<HTMLDivElement>(null)

  const peekH = 90
  const halfH = useRef(340)
  const fullH = useRef(580)

  useEffect(() => {
    const update = () => {
      halfH.current = Math.round(window.innerHeight * 0.42)
      fullH.current = Math.round(window.innerHeight * 0.76)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => { setSnap('half'); setLiveH(null) }, [pin.id])

  function snapH(s: Snap) {
    if (s === 'peek') return peekH
    if (s === 'half') return halfH.current
    return fullH.current
  }

  const snapToHeight = useCallback((h: number) => {
    const mid1 = (peekH + halfH.current) / 2
    const mid2 = (halfH.current + fullH.current) / 2
    if (h < mid1) setSnap('peek')
    else if (h < mid2) setSnap('half')
    else setSnap('full')
    setLiveH(null)
  }, [])

  function onTouchStart(e: React.TouchEvent) {
    isDragging.current = true
    startY.current = e.touches[0].clientY
    startH.current = liveH ?? snapH(snap)
    if (ref.current) ref.current.style.transition = 'none'
  }
  function onTouchMove(e: React.TouchEvent) {
    if (!isDragging.current) return
    const dy = startY.current - e.touches[0].clientY
    setLiveH(Math.max(peekH, Math.min(fullH.current, startH.current + dy)))
  }
  function onTouchEnd() {
    isDragging.current = false
    if (ref.current) ref.current.style.transition = ''
    snapToHeight(liveH ?? snapH(snap))
  }

  const currentH = liveH ?? snapH(snap)
  const hasImage = !!pin.image
  const subImages = pin.images ?? []

  return (
    <>
      <div
        ref={ref}
        className="absolute bottom-20 md:bottom-0 left-0 right-0 z-[1050] bg-white rounded-t-3xl shadow-[0_-8px_40px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col"
        style={{ height: `${currentH}px`, transition: 'height 0.3s cubic-bezier(0.32,0.72,0,1)' }}
      >
        {/* Drag handle */}
        <div
          className="flex-shrink-0 flex flex-col items-center pt-3 pb-1 cursor-grab active:cursor-grabbing touch-none select-none"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto overscroll-contain">

          {/* Hero image */}
          {hasImage && snap !== 'peek' && (
            <div
              className="relative mx-4 mb-4 rounded-2xl overflow-hidden cursor-pointer"
              style={{ height: snap === 'full' ? 200 : 130 }}
              onClick={() => setLightboxImg(pin.image!)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={pin.image} alt={de ? pin.title.de : pin.title.en} className="w-full h-full object-cover" />
              {/* Bottom gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              {/* Category badge on image */}
              <div className="absolute bottom-3 left-3">
                <span
                  className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full text-white"
                  style={{ backgroundColor: cat.color }}
                >
                  {de ? cat.label.de : cat.label.en}
                </span>
              </div>
              {/* Expand hint */}
              <div className="absolute bottom-3 right-3 bg-white/20 backdrop-blur rounded-full p-1">
                <ChevronRight size={12} className="text-white rotate-45" />
              </div>
            </div>
          )}

          <div className="px-5 pb-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {!hasImage && (
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ backgroundColor: `${cat.color}18` }}
                  >
                    {cat.emoji}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  {!hasImage && (
                    <span
                      className="inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mb-1"
                      style={{ backgroundColor: `${cat.color}18`, color: cat.color }}
                    >
                      {de ? cat.label.de : cat.label.en}
                    </span>
                  )}
                  <h2 className="text-[18px] font-extrabold text-gray-900 leading-tight">
                    {de ? pin.title.de : pin.title.en}
                  </h2>
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex-shrink-0 w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Description */}
            {snap !== 'peek' && (
              <p className="text-[14px] text-gray-600 leading-relaxed mb-4">
                {de ? pin.description.de : pin.description.en}
              </p>
            )}

            {/* Photo gallery */}
            {snap === 'full' && subImages.length > 0 && (
              <div className="mb-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                  {de ? 'Fotos' : 'Photos'}
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                  {subImages.map((url, i) => (
                    <div
                      key={i}
                      className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden cursor-pointer border border-gray-100 hover:scale-105 transition-transform"
                      onClick={() => setLightboxImg(url)}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Local tip */}
            {snap === 'full' && (pin.tip.de || pin.tip.en) && (
              <div
                className="flex items-start gap-3 p-4 rounded-2xl mb-4"
                style={{ backgroundColor: `${cat.color}10` }}
              >
                <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${cat.color}20` }}>
                  <Lightbulb size={14} style={{ color: cat.color }} />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: cat.color }}>
                    {de ? 'Lokaler Tipp' : 'Local Tip'}
                  </div>
                  <p className="text-[13px] text-gray-700 leading-relaxed">
                    {de ? pin.tip.de : pin.tip.en}
                  </p>
                </div>
              </div>
            )}

            {/* Route button */}
            {snap !== 'peek' && (
              <button
                onClick={onGetRoute}
                disabled={routeLoading}
                className="w-full flex items-center justify-center gap-2.5 text-white text-[14px] font-extrabold py-4 rounded-2xl transition-all active:scale-[0.98] disabled:opacity-70"
                style={{
                  backgroundColor: cat.color,
                  boxShadow: `0 8px 24px ${cat.color}45`,
                }}
              >
                {routeLoading ? (
                  <><Loader2 size={18} className="animate-spin" />{de ? 'Route wird berechnet…' : 'Calculating route…'}</>
                ) : hasRoute ? (
                  <><Navigation2 size={18} />{de ? 'Route neu berechnen' : 'Recalculate route'}</>
                ) : (
                  <><Navigation2 size={18} />{de ? 'Fahrradroute berechnen' : 'Get cycling route'}</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-[2000] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxImg(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightboxImg}
            alt=""
            className="max-w-full max-h-full object-contain rounded-2xl"
            onClick={e => e.stopPropagation()}
          />
          <button
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            onClick={() => setLightboxImg(null)}
          >
            <X size={20} />
          </button>
        </div>
      )}
    </>
  )
}
