'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion'
import { Mail, Phone, ChevronDown, ChevronLeft, ChevronRight, Zap, Battery, Gauge, Weight, Check, ArrowUpRight } from 'lucide-react'
import { useLocale } from '@/components/LocaleProvider'
import InteractiveGrid from '@/components/InteractiveGrid'

const CONTACT_EMAIL = 'drahtesel-ney@outlook.com'
const CONTACT_PHONE = 'tel:+4949324980397'
const CONTACT_PHONE_DISPLAY = '+49 4932 4980397'

const ease = [0.22, 1, 0.36, 1] as const
const QUICK_ICONS = [<Zap size={13} key="z" />, <Battery size={13} key="b" />, <Gauge size={13} key="g" />, <Weight size={13} key="w" />]

// ─── Types ────────────────────────────────────────────────────────────────────
interface ShopBikeStat { value: string; unit: string; labelDe: string; labelEn: string; sub: string }
interface ShopBikeSpec { keyDe: string; keyEn: string; valueDe: string; valueEn: string }
interface ShopBikeBenefit { n: string; titleDe: string; titleEn: string; bodyDe: string; bodyEn: string; imgSrc?: string; imgPosition?: string; imgPositionX?: number; imgPositionY?: number; hideText?: boolean }
interface ShopBikeFaq { q: string; a: string }
interface ShopBike {
  id: string; name: string; subtitleDe: string; subtitleEn: string; badgeDe: string; badgeEn: string
  price: string; accentColor: string; heroImage: string; heroImageMobile?: string; cardImage: string; triptychImage: string
  descriptionDe: string; descriptionEn: string; colors: string[]
  benefitsTitleDe?: string; benefitsTitleEn?: string
  stats: ShopBikeStat[]; specs: ShopBikeSpec[]
  highlightsDe: string[]; highlightsEn: string[]
  benefits: ShopBikeBenefit[]; faqsDe: ShopBikeFaq[]; faqsEn: ShopBikeFaq[]
}

// ─── Hero name helper ─────────────────────────────────────────────────────────
function parseHeroName(name: string) {
  const parts = name.split(' ')
  return { brand: parts[0], model: parts[1] ?? '', grade: parts.slice(2).join(' ') }
}

// ─── Benefits section (magnetic spotlight) ───────────────────────────────────
function BenefitsSection({ de, bike }: { de: boolean; bike: ShopBike }) {
  const accent = bike.accentColor
  const r = parseInt(accent.slice(1, 3), 16)
  const g = parseInt(accent.slice(3, 5), 16)
  const b = parseInt(accent.slice(5, 7), 16)

  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)
  const springX = useSpring(mouseX, { stiffness: 50, damping: 18 })
  const springY = useSpring(mouseY, { stiffness: 50, damping: 18 })
  const spotX = useTransform(springX, v => `${v * 100}%`)
  const spotY = useTransform(springY, v => `${v * 100}%`)
  const spotlight = useMotionTemplate`radial-gradient(600px circle at ${spotX} ${spotY}, rgba(${r},${g},${b},0.22), rgba(${r},${g},${b},0.06) 50%, transparent 75%)`

  function onMouseMove(e: React.MouseEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
  }

  return (
    <section className="py-28 md:py-44 relative overflow-hidden border-t border-white/[0.05]" onMouseMove={onMouseMove}>
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full blur-[120px]"
          style={{ backgroundColor: `${accent}14` }} />
      </div>
      <motion.div className="pointer-events-none absolute inset-0 z-0" style={{ background: spotlight }} />
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")', backgroundSize: '200px 200px' }} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 md:mb-16"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.25em] mb-5 block" style={{ color: accent }}>
            {de ? 'WARUM DRAHTESEL' : 'WHY DRAHTESEL'}
          </span>
          <h2 className="text-4xl md:text-[5.5rem] font-black leading-[0.9] tracking-tight max-w-2xl whitespace-pre-line">
            {de ? (bike.benefitsTitleDe ?? 'Gebaut für\nNorderney.') : (bike.benefitsTitleEn ?? 'Built for\nNorderney.')}
          </h2>
        </motion.div>
        {/* Mobile: horizontal scroll snap — Desktop: grid */}
        <div className={`
          hidden md:grid gap-4
          ${bike.benefits.length === 4 ? 'md:grid-cols-2' : 'md:grid-cols-3'}
        `}>
          {bike.benefits.map((c, i) => (
            <BenefitCard
              key={c.n} n={c.n}
              title={de ? c.titleDe : c.titleEn}
              body={de ? c.bodyDe : c.bodyEn}
              imgSrc={c.imgSrc}
              imgPosition={c.imgPosition}
              imgPositionX={c.imgPositionX}
              imgPositionY={c.imgPositionY}
              hideText={c.hideText}
              triptychImage={bike.triptychImage}
              accentColor={accent}
              delay={i * 0.12}
            />
          ))}
        </div>

        {/* Mobile scroll */}
        <div className="md:hidden">
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth -mx-4 px-4 pb-4 scrollbar-hide">
            {bike.benefits.map((c, i) => (
              <div key={c.n} className="snap-center flex-shrink-0 w-[78vw]">
                <BenefitCard
                  n={c.n}
                  title={de ? c.titleDe : c.titleEn}
                  body={de ? c.bodyDe : c.bodyEn}
                  imgSrc={c.imgSrc}
                  imgPosition={c.imgPosition}
                  imgPositionX={c.imgPositionX}
                  imgPositionY={c.imgPositionY}
                  hideText={c.hideText}
                  triptychImage={bike.triptychImage}
                  accentColor={accent}
                  delay={0}
                  mobileHeight
                />
              </div>
            ))}
          </div>
          {/* Swipe hint dots */}
          <div className="flex justify-center gap-1.5 mt-4">
            {bike.benefits.map((c, i) => (
              <div
                key={c.n}
                className="h-[3px] rounded-full transition-all duration-300"
                style={{
                  width: i === 0 ? '20px' : '6px',
                  backgroundColor: i === 0 ? accent : 'rgba(255,255,255,0.2)',
                }}
              />
            ))}
          </div>
          <p className="text-center text-white/20 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">
            {de ? 'Wischen zum Entdecken' : 'Swipe to explore'}
          </p>
        </div>
      </div>
    </section>
  )
}

// ─── Benefit card (3D tilt) ───────────────────────────────────────────────────
function BenefitCard({ n, title, body, imgSrc, imgPosition, imgPositionX, imgPositionY, triptychImage, accentColor, delay, hideText, mobileHeight }: {
  n: string; title: string; body: string
  imgSrc?: string; imgPosition?: string; imgPositionX?: number; imgPositionY?: number
  triptychImage: string; accentColor: string; delay: number; hideText?: boolean; mobileHeight?: boolean
}) {
  // If card has its own image, use it cover; otherwise fall back to triptych crop
  const useOwnImg = Boolean(imgSrc)
  const bgImage = `url(${useOwnImg ? imgSrc : triptychImage})`
  const bgPosition = useOwnImg
    ? 'center center'
    : imgPositionX !== undefined
      ? `${imgPositionX}% ${imgPositionY ?? 50}%`
      : `${imgPosition ?? '50%'} center`
  const bgSize = useOwnImg ? 'cover' : imgPositionX !== undefined ? '200% 200%' : '300% auto'
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const glareX = useMotionValue(50)
  const glareY = useMotionValue(50)
  const springRotX = useSpring(rotateX, { stiffness: 180, damping: 22 })
  const springRotY = useSpring(rotateY, { stiffness: 180, damping: 22 })

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    rotateY.set(((e.clientX - rect.left) / rect.width - 0.5) * 14)
    rotateX.set(-((e.clientY - rect.top) / rect.height - 0.5) * 14)
    glareX.set((e.clientX - rect.left) / rect.width * 100)
    glareY.set((e.clientY - rect.top) / rect.height * 100)
  }
  function onMouseLeave() { rotateX.set(0); rotateY.set(0) }

  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.08), transparent 60%)`

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }}
      style={{ rotateX: springRotX, rotateY: springRotY, transformPerspective: 900, transformStyle: 'preserve-3d' }}
      onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}
      className={`group relative rounded-3xl overflow-hidden border border-white/[0.09] cursor-default ${mobileHeight ? 'h-[340px]' : 'h-[420px] md:h-[480px]'}`}
    >
      <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
        style={{ backgroundImage: bgImage, backgroundSize: bgSize, backgroundPosition: bgPosition, backgroundRepeat: 'no-repeat' }} />
      {!hideText && <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10" />}
      {hideText && <div className="absolute inset-0 bg-black/20" />}
      <motion.div className="absolute inset-0 pointer-events-none z-10" style={{ background: glare }} />
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ boxShadow: `inset 0 0 0 1px ${accentColor}59` }} />

      {!hideText && (
        <div className="relative z-20 h-full flex flex-col justify-between p-7 md:p-8">
          <div className="flex items-start justify-between">
            <span className="text-5xl font-black text-white/10 group-hover:text-white/20 transition-colors duration-500 leading-none select-none">{n}</span>
            <ArrowUpRight size={18} className="text-white/20 group-hover:text-white/60 transition-colors duration-300 mt-1" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white mb-2 leading-snug">{title}</h3>
            <p className="text-white/50 text-sm leading-relaxed group-hover:text-white/70 transition-colors duration-300">{body}</p>
          </div>
        </div>
      )}
    </motion.div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function PricingClient({ initialBikes }: { initialBikes: ShopBike[] }) {
  const { locale } = useLocale()
  const de = locale === 'de'

  const [bikes] = useState<ShopBike[]>(initialBikes)
  const [activeIndex, setActiveIndex] = useState(0)
  const [specsOpen, setSpecsOpen] = useState(false)
  const [selectedColor, setSelectedColor] = useState(initialBikes[0]?.colors?.[0] ?? '')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    if (bikes[activeIndex]) {
      setSelectedColor(bikes[activeIndex].colors?.[0] ?? '')
      setSpecsOpen(false)
      setOpenFaq(null)
    }
  }, [activeIndex]) // eslint-disable-line react-hooks/exhaustive-deps

  function goTo(idx: number) { setActiveIndex(idx) }
  function nextBike() { goTo((activeIndex + 1) % bikes.length) }
  function prevBike() { goTo((activeIndex - 1 + bikes.length) % bikes.length) }

  if (bikes.length === 0) {
    return (
      <div className="bg-[#080808] min-h-screen flex items-center justify-center text-white/30 text-sm">
        {de ? 'Keine Fahrräder gefunden.' : 'No bikes found.'}
      </div>
    )
  }

  const bike = bikes[activeIndex]
  const accent = bike.accentColor || '#C8102E'
  const faqs = de ? bike.faqsDe : bike.faqsEn
  const specs = bike.specs.map(s => [de ? s.keyDe : s.keyEn, de ? s.valueDe : s.valueEn])
  const highlights = de ? bike.highlightsDe : bike.highlightsEn
  const { brand, model, grade } = parseHeroName(bike.name)

  const mailSubject = de ? `Anfrage: ${bike.name}` : `Enquiry: ${bike.name}`
  const mailBody = de
    ? `Hallo,\n\nich interessiere mich für das ${bike.name} (${selectedColor}).\n\nBitte kontaktiert mich.\n\nVielen Dank`
    : `Hello,\n\nI am interested in the ${bike.name} (${selectedColor}).\n\nPlease contact me.\n\nThank you`

  return (
    <div className="min-h-screen overflow-x-hidden text-white" style={{ backgroundColor: '#080808' }}>
      {/* Adaptive ambient tint — full page color per bike */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 transition-all duration-[1000ms]"
        style={{
          background: `
            radial-gradient(ellipse 140% 60% at 50% 0%, ${accent}40 0%, transparent 55%),
            radial-gradient(ellipse 100% 80% at 80% 100%, ${accent}22 0%, transparent 60%),
            radial-gradient(ellipse 80% 50% at 20% 60%, ${accent}18 0%, transparent 55%)
          `,
        }}
      />

      {/* ─── Slider navigation (only when multiple bikes) ────────── */}
      {bikes.length > 1 && (
        <>
          <button
            onClick={prevBike}
            className="fixed left-3 md:left-5 top-1/2 -translate-y-1/2 z-50 w-11 h-11 rounded-full bg-black/50 backdrop-blur-md border border-white/[0.12] flex items-center justify-center text-white/50 hover:text-white hover:bg-black/80 hover:border-white/25 transition-all duration-200 shadow-xl"
            aria-label="Previous bike"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextBike}
            className="fixed right-3 md:right-5 top-1/2 -translate-y-1/2 z-50 w-11 h-11 rounded-full bg-black/50 backdrop-blur-md border border-white/[0.12] flex items-center justify-center text-white/50 hover:text-white hover:bg-black/80 hover:border-white/25 transition-all duration-200 shadow-xl"
            aria-label="Next bike"
          >
            <ChevronRight size={20} />
          </button>
          <div className="fixed bottom-28 md:bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2">
            <div className="flex gap-2">
              {bikes.map((b, i) => (
                <button
                  key={b.id}
                  onClick={() => goTo(i)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === activeIndex ? '20px' : '8px',
                    height: '8px',
                    backgroundColor: i === activeIndex ? accent : 'rgba(255,255,255,0.2)',
                  }}
                  aria-label={`Bike ${i + 1}`}
                />
              ))}
            </div>
            <span className="text-white/25 text-[10px] font-bold tracking-[0.2em] uppercase">
              {activeIndex + 1} / {bikes.length}
            </span>
          </div>
        </>
      )}

      {/* ─── Animated page content ───────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={bike.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="relative z-10"
        >

          {/* ══════════════════════════════════════════════════════
              HERO
          ══════════════════════════════════════════════════════ */}
          <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <div aria-hidden className="pointer-events-none absolute inset-0">
              {/* Desktop hero image — always rendered as base (fallback for mobile too) */}
              <Image
                key={bike.heroImage}
                src={bike.heroImage}
                alt="" fill priority
                className="object-cover object-center opacity-80"
                sizes="100vw"
              />
              {/* Mobile hero image — overlays on top on mobile when available */}
              {bike.heroImageMobile && (
                <Image
                  key={`${bike.heroImage}-mobile`}
                  src={bike.heroImageMobile}
                  alt="" fill priority
                  className="md:hidden object-cover object-center opacity-80"
                  sizes="100vw"
                />
              )}
              <div className="absolute inset-0 bg-[#080808]/20" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/10 via-transparent to-[#080808]/65" />
            </div>

            <div className="absolute inset-0">
              <InteractiveGrid
                gridSize={55} radius={320} repulsionStrength={0.75}
                dotSize={2} gridThickness={0.7} baseOpacity={0.18}
                dotColor="#ffffff" lineColor="#ffffff" accentColor={accent}
              />
            </div>

            <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto pt-24 pb-32 md:pt-28 md:pb-24 pointer-events-none [&_a]:pointer-events-auto [&_button]:pointer-events-auto">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
                <span className="inline-flex items-center gap-2.5 border text-[10px] font-black uppercase tracking-[0.25em] px-4 py-2 rounded-full mb-10"
                  style={{ borderColor: `${accent}66`, backgroundColor: `${accent}1a`, color: accent }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: accent }} />
                  {de ? 'Jetzt im Shop verfügbar' : 'Now Available in Store'}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease, delay: 0.15 }}
                className="text-[clamp(3.5rem,12vw,9rem)] font-black leading-[0.88] tracking-tight mb-8"
              >
                {brand}<br />
                <span style={{ color: accent }}>{model}</span><br />
                {grade && <span className="text-white/30">{grade}</span>}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease, delay: 0.35 }}
                className="text-white/40 text-lg md:text-xl max-w-lg mx-auto mb-12 leading-relaxed font-light"
              >
                {de ? bike.descriptionDe : bike.descriptionEn}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease, delay: 0.5 }}
                className="flex items-baseline justify-center gap-3 mb-10"
              >
                <span className="text-white/30 text-base font-medium">{de ? 'ab' : 'from'}</span>
                <span className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight">€&thinsp;{bike.price}</span>
                <span className="text-white/30 text-base font-medium">{de ? 'inkl. MwSt.' : 'incl. VAT'}</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease, delay: 0.65 }}
                className="flex flex-col sm:flex-row gap-3 justify-center"
              >
                <motion.a
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`}
                  className="flex items-center justify-center gap-2.5 text-white font-bold text-[15px] px-8 py-4 rounded-2xl transition-colors"
                  style={{ backgroundColor: accent, boxShadow: `0 0 50px ${accent}73` }}
                >
                  <Mail size={17} />
                  {de ? 'Per E-Mail anfragen' : 'Enquire by Email'}
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  href={CONTACT_PHONE}
                  className="flex items-center justify-center gap-2.5 bg-white/[0.07] text-white font-bold text-[15px] px-8 py-4 rounded-2xl hover:bg-white/[0.12] transition-colors border border-white/[0.09]"
                >
                  <Phone size={17} />
                  {de ? 'Anrufen' : 'Call Us'}
                </motion.a>
              </motion.div>
            </div>

            <motion.div
              className="absolute bottom-24 md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
            >
              <span className="text-white/20 text-[10px] font-bold uppercase tracking-[0.25em]">
                {de ? 'Entdecken' : 'Explore'}
              </span>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                className="w-px h-10 bg-gradient-to-b from-white/20 to-transparent"
              />
            </motion.div>
          </section>


          {/* ══════════════════════════════════════════════════════
              STATS BAR
          ══════════════════════════════════════════════════════ */}
          <section className="border-y border-white/[0.06] bg-white/[0.02]">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
              <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-white/[0.06]">
                {bike.stats.map((s, i) => (
                  <motion.div
                    key={s.labelDe}
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7, ease, delay: i * 0.08 }}
                    className="flex flex-col items-center justify-center text-center py-10 px-6 gap-1"
                  >
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-4xl md:text-5xl font-black text-white">{s.value}</span>
                      <span className="text-xl font-black" style={{ color: accent }}>{s.unit}</span>
                    </div>
                    <span className="text-white/60 text-xs font-bold uppercase tracking-widest">{de ? s.labelDe : s.labelEn}</span>
                    <span className="text-white/20 text-[10px]">{s.sub}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>


          {/* ══════════════════════════════════════════════════════
              PRODUCT SHOWCASE
          ══════════════════════════════════════════════════════ */}
          <section className="py-28 md:py-44">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <motion.div
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.9, ease }}
                className="mb-16 md:mb-20"
              >
                <span className="text-[10px] font-black uppercase tracking-[0.25em] mb-5 block" style={{ color: accent }}>
                  {de ? bike.subtitleDe : bike.subtitleEn}
                </span>
                <h2 className="text-4xl md:text-[5.5rem] font-black leading-[0.9] tracking-tight max-w-2xl whitespace-pre-line">
                  {de ? 'Technologie,\ndie begeistert.' : 'Engineering\nthat inspires.'}
                </h2>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }} transition={{ duration: 1.1, ease, delay: 0.1 }}
                className="relative rounded-3xl overflow-hidden border border-white/[0.08] bg-white/[0.03]"
              >
                <div aria-hidden className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 rounded-full blur-[100px]"
                  style={{ backgroundColor: `${accent}33` }} />

                <div className="grid md:grid-cols-2">
                  {/* Image pane */}
                  <div className="relative min-h-[380px] md:min-h-[560px] overflow-hidden border-b md:border-b-0 md:border-r border-white/[0.06]">
                    <Image
                      src={bike.cardImage} alt={bike.name} fill
                      className="object-contain object-center hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute top-5 left-5 z-10">
                      <span className="text-white text-[10px] font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded-full shadow-lg"
                        style={{ backgroundColor: accent }}>
                        {de ? bike.badgeDe : bike.badgeEn}
                      </span>
                    </div>
                    <div className="absolute top-5 right-5 z-10">
                      <span className="bg-black/50 backdrop-blur-md text-white/70 text-[10px] font-bold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full border border-white/[0.12]">
                        {de ? 'Demnächst online' : 'Coming Soon'}
                      </span>
                    </div>
                  </div>

                  {/* Detail pane */}
                  <div className="p-8 md:p-12 flex flex-col gap-8">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2" style={{ color: accent }}>
                        {de ? bike.subtitleDe : bike.subtitleEn}
                      </p>
                      <h3 className="text-3xl md:text-4xl font-black leading-tight mb-1">{bike.name}</h3>
                      <div className="flex items-baseline gap-2 mt-3">
                        <span className="text-4xl font-black">€&thinsp;{bike.price}</span>
                        <span className="text-white/30 text-sm">{de ? 'inkl. MwSt.' : 'incl. VAT'}</span>
                      </div>
                    </div>

                    {/* Color selector */}
                    {bike.colors?.length > 0 && (
                      <div>
                        <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em] mb-3">
                          {de ? 'Farbe' : 'Color'}: <span className="text-white/70 normal-case tracking-normal font-bold">{selectedColor}</span>
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {bike.colors.map(color => (
                            <button
                              key={color}
                              onClick={() => setSelectedColor(color)}
                              className="px-4 py-2 rounded-xl text-sm font-bold border transition-all duration-300"
                              style={selectedColor === color
                                ? { borderColor: accent, color: accent, backgroundColor: `${accent}1a` }
                                : { borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.3)' }
                              }
                            >
                              {color}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quick specs (first 4) */}
                    <div className="grid grid-cols-2 gap-2.5">
                      {bike.specs.slice(0, 4).map((s, i) => (
                        <div key={s.keyDe} className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-4 hover:border-white/[0.14] hover:bg-white/[0.06] transition-all">
                          <div className="flex items-center gap-1.5 mb-2" style={{ color: accent }}>
                            {QUICK_ICONS[i]}
                            <span className="text-[9px] font-black uppercase tracking-[0.18em] text-white/25">{de ? s.keyDe : s.keyEn}</span>
                          </div>
                          <p className="text-sm font-bold text-white/80">{de ? s.valueDe : s.valueEn}</p>
                        </div>
                      ))}
                    </div>

                    {/* Full specs accordion */}
                    <div className="border-t border-white/[0.06] pt-1">
                      <button
                        onClick={() => setSpecsOpen(v => !v)}
                        className="w-full flex items-center justify-between py-4 text-sm font-bold text-white/30 hover:text-white/60 transition-colors"
                      >
                        <span>
                          {specsOpen
                            ? (de ? 'Technische Daten ausblenden' : 'Hide full specs')
                            : (de ? 'Alle technischen Daten anzeigen' : 'Show all specs')}
                        </span>
                        <motion.div animate={{ rotate: specsOpen ? 180 : 0 }} transition={{ duration: 0.35 }}>
                          <ChevronDown size={16} />
                        </motion.div>
                      </button>

                      <AnimatePresence>
                        {specsOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease }}
                            className="overflow-hidden"
                          >
                            <div className="pb-4">
                              {specs.map(([k, v]) => (
                                <div key={k} className="flex justify-between items-start py-2.5 border-b border-white/[0.04]">
                                  <span className="text-white/25 text-xs flex-shrink-0 w-28">{k}</span>
                                  <span className="text-white/70 text-xs font-medium text-right">{v}</span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* CTA buttons */}
                    <div className="flex flex-col gap-3">
                      <a
                        href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`}
                        className="flex items-center justify-center gap-2.5 text-white font-bold text-[15px] py-4 rounded-2xl transition-colors active:scale-[0.98]"
                        style={{ backgroundColor: accent, boxShadow: `0 0 40px ${accent}4d` }}
                      >
                        <Mail size={16} />
                        {de ? 'Per E-Mail anfragen' : 'Enquire by Email'}
                      </a>
                      <a
                        href={CONTACT_PHONE}
                        className="flex items-center justify-center gap-2.5 bg-white/[0.06] text-white font-bold text-[15px] py-4 rounded-2xl hover:bg-white/[0.1] transition-colors border border-white/[0.08] active:scale-[0.98]"
                      >
                        <Phone size={16} />
                        {CONTACT_PHONE_DISPLAY}
                      </a>
                    </div>

                    <p className="text-white/20 text-xs text-center -mt-3">
                      {de ? 'Antwort in der Regel innerhalb von 24 Stunden.' : 'We usually reply within 24 hours.'}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>


          {/* ══════════════════════════════════════════════════════
              BENEFITS
          ══════════════════════════════════════════════════════ */}
          <BenefitsSection de={de} bike={bike} />


          {/* ══════════════════════════════════════════════════════
              HIGHLIGHTS
          ══════════════════════════════════════════════════════ */}
          <section className="py-28 md:py-44 border-t border-white/[0.05]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-start">
                <motion.div
                  initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.9, ease }}
                >
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] mb-5 block" style={{ color: accent }}>
                    Highlights
                  </span>
                  <h2 className="text-4xl md:text-[5rem] font-black leading-[0.9] tracking-tight mb-6 whitespace-pre-line">
                    {de ? 'Das Beste\ndes Besten.' : 'The Best\nof the Best.'}
                  </h2>
                  <p className="text-white/35 leading-relaxed text-base">
                    {de
                      ? `Der ${bike.name} vereint modernste Technologie mit unübertroffener Zuverlässigkeit.`
                      : `The ${bike.name} combines cutting-edge technology with unmatched reliability.`}
                  </p>
                </motion.div>

                <div className="flex flex-col gap-2.5">
                  {highlights.map((h, i) => (
                    <motion.div
                      key={h}
                      initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.6, ease, delay: i * 0.08 }}
                      className="group flex items-center gap-4 p-4 md:p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-all duration-300"
                    >
                      <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
                        style={{ backgroundColor: `${accent}1a`, border: `1px solid ${accent}33` }}>
                        <Check size={13} style={{ color: accent }} />
                      </div>
                      <span className="text-white/50 text-sm font-medium group-hover:text-white/80 transition-colors">{h}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>


          {/* ══════════════════════════════════════════════════════
              FAQ
          ══════════════════════════════════════════════════════ */}
          <section className="py-28 md:py-44 border-t border-white/[0.05] relative overflow-hidden">
            <div aria-hidden className="pointer-events-none absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full blur-[100px]"
              style={{ backgroundColor: `${accent}0d` }} />

            <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
              <motion.div
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.9, ease }}
                className="mb-14 md:mb-18"
              >
                <span className="text-[10px] font-black uppercase tracking-[0.25em] mb-5 block" style={{ color: accent }}>FAQ</span>
                <h2 className="text-4xl md:text-[5rem] font-black leading-[0.9] tracking-tight whitespace-pre-line">
                  {de ? 'Häufige\nFragen.' : 'Frequently\nAsked.'}
                </h2>
              </motion.div>

              <div className="flex flex-col gap-2">
                {faqs.map((faq, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.6, ease, delay: i * 0.07 }}
                    className="rounded-2xl border transition-all duration-300 overflow-hidden"
                    style={{
                      borderColor: openFaq === i ? `${accent}4d` : 'rgba(255,255,255,0.07)',
                      backgroundColor: openFaq === i ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                    }}
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between gap-4 p-6 text-left"
                    >
                      <span className={`font-bold text-[15px] leading-snug transition-colors ${openFaq === i ? 'text-white' : 'text-white/70'}`}>
                        {faq.q}
                      </span>
                      <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.35 }} className="flex-shrink-0">
                        <ChevronDown size={18} style={{ color: openFaq === i ? accent : 'rgba(255,255,255,0.25)' }} />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {openFaq === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease }}
                          className="overflow-hidden"
                        >
                          <p className="px-6 pb-6 text-white/45 text-sm leading-relaxed">{faq.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>


          {/* ══════════════════════════════════════════════════════
              CONTACT CTA
          ══════════════════════════════════════════════════════ */}
          <section className="py-28 md:py-44 relative overflow-hidden border-t border-white/[0.05]">
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(to bottom, transparent, ${accent}0a, transparent)` }} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[130px]"
                style={{ backgroundColor: `${accent}14` }} />
            </div>

            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
              <motion.div
                initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.9, ease }}
              >
                <span className="text-[10px] font-black uppercase tracking-[0.25em] mb-6 block" style={{ color: accent }}>
                  {de ? 'NOCH FRAGEN?' : 'GOT QUESTIONS?'}
                </span>
                <h2 className="text-4xl sm:text-5xl md:text-[7rem] font-black leading-[0.88] tracking-tight mb-6 whitespace-pre-line">
                  {de ? 'Wir sind\nfür dich da.' : "We're here\nfor you."}
                </h2>
                <p className="text-white/35 text-lg max-w-md mx-auto mb-14 leading-relaxed">
                  {de
                    ? 'Beratung, Probefahrt, Finanzierung — persönlich und unkompliziert auf Norderney.'
                    : 'Advice, test rides, financing — personal and simple on Norderney.'}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.a
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="flex items-center justify-center gap-2.5 bg-white text-black font-bold text-[13px] sm:text-[15px] px-5 sm:px-8 py-4 rounded-2xl hover:bg-white/90 transition-colors min-w-0 overflow-hidden"
                  >
                    <Mail size={17} className="flex-shrink-0" />
                    <span className="truncate">{CONTACT_EMAIL}</span>
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    href={CONTACT_PHONE}
                    className="flex items-center justify-center gap-2.5 text-white font-bold text-[15px] px-8 py-4 rounded-2xl transition-colors"
                    style={{ backgroundColor: accent, boxShadow: `0 0 50px ${accent}59` }}
                  >
                    <Phone size={17} />
                    {CONTACT_PHONE_DISPLAY}
                  </motion.a>
                </div>

                <p className="text-white/15 text-sm mt-10">
                  {de
                    ? 'Antwort in der Regel innerhalb von 24 Stunden · Persönliche Beratung auch vor Ort'
                    : 'Usually reply within 24 hours · In-person consultation also available'}
                </p>
              </motion.div>
            </div>
          </section>

        </motion.div>
      </AnimatePresence>
    </div>
  )
}
