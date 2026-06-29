import 'server-only'
import { supabase } from './supabase'

// ── Types ─────────────────────────────────────────────────────────────────────
export type Review = { id: string; name: string; date: string; rating: number; text: string; source: string }
export type Faq = { id: string; question: string; answer: string }
export type Settings = {
  passwordHash: string | null
  mietrad?: Record<string, unknown>
}

export type ShopBikeStat   = { value: string; unit: string; labelDe: string; labelEn: string; sub: string }
export type ShopBikeSpec   = { keyDe: string; keyEn: string; valueDe: string; valueEn: string }
export type ShopBikeBenefit = {
  n: string; titleDe: string; titleEn: string; bodyDe: string; bodyEn: string
  imgSrc?: string
  imgPosition?: string
  imgPositionX?: number
  imgPositionY?: number
  hideText?: boolean
}
export type ShopBikeFaq = { q: string; a: string }
export type ShopBike = {
  id: string
  name: string
  subtitleDe: string
  subtitleEn: string
  badgeDe: string
  badgeEn: string
  price: string
  accentColor: string
  heroImage: string
  heroImageMobile?: string
  cardImage: string
  triptychImage: string
  descriptionDe: string
  descriptionEn: string
  colors: string[]
  stats: ShopBikeStat[]
  specs: ShopBikeSpec[]
  highlightsDe: string[]
  highlightsEn: string[]
  benefits: ShopBikeBenefit[]
  faqsDe: ShopBikeFaq[]
  faqsEn: ShopBikeFaq[]
  benefitsTitleDe?: string
  benefitsTitleEn?: string
}

export type Report = {
  id: string
  bikeNumber: string
  lat: number | null
  lng: number | null
  note: string
  createdAt: string
  resolved: boolean
}

// ── Generic key-value helpers ─────────────────────────────────────────────────
async function readKV<T>(key: string, fallback: T): Promise<T> {
  try {
    const { data, error } = await supabase
      .from('kv_store')
      .select('data')
      .eq('key', key)
      .single()
    if (error || !data) return fallback
    return data.data as T
  } catch {
    return fallback
  }
}

async function writeKV<T>(key: string, value: T): Promise<void> {
  await supabase
    .from('kv_store')
    .upsert({ key, data: value, updated_at: new Date().toISOString() })
}

// ── Reviews ───────────────────────────────────────────────────────────────────
export async function readReviews(): Promise<Review[]>   { return readKV<Review[]>('reviews', []) }
export async function writeReviews(r: Review[]): Promise<void> { return writeKV('reviews', r) }

// ── FAQs ─────────────────────────────────────────────────────────────────────
export async function readFaqs(): Promise<Faq[]>         { return readKV<Faq[]>('faqs', []) }
export async function writeFaqs(f: Faq[]): Promise<void> { return writeKV('faqs', f) }

// ── Settings ──────────────────────────────────────────────────────────────────
export async function readSettings(): Promise<Settings> {
  return readKV<Settings>('settings', { passwordHash: null })
}
export async function writeSettings(s: Settings): Promise<void> { return writeKV('settings', s) }

// ── Shop Bikes ────────────────────────────────────────────────────────────────
export async function readShopBikes(): Promise<ShopBike[]>          { return readKV<ShopBike[]>('shop_bikes', []) }
export async function writeShopBikes(b: ShopBike[]): Promise<void>  { return writeKV('shop_bikes', b) }

// ── Hero Images ───────────────────────────────────────────────────────────────
export type HeroImage = { id: string; desktop: string; mobile?: string }

const DEFAULT_HERO_IMAGES: HeroImage[] = [
  { id: '1',  desktop: '/hero/hero-1.jpg',  mobile: '/hero/hero-1-mobile.jpg'  },
  { id: '2',  desktop: '/hero/hero-2.jpg',  mobile: '/hero/hero-2-mobile.jpg'  },
  { id: '3',  desktop: '/hero/hero-3.jpg',  mobile: '/hero/hero-3-mobile.jpg'  },
  { id: '4',  desktop: '/hero/hero-4.jpg',  mobile: '/hero/hero-4-mobile.jpg'  },
  { id: '5',  desktop: '/hero/hero-5.jpg',  mobile: '/hero/hero-5-mobile.jpg'  },
  { id: '6',  desktop: '/hero/hero-6.jpg',  mobile: '/hero/hero-6-mobile.jpg'  },
  { id: '7',  desktop: '/hero/hero-7.jpg',  mobile: '/hero/hero-7-mobile.jpg'  },
  { id: '8',  desktop: '/hero/hero-8.jpg',  mobile: '/hero/hero-8-mobile.jpg'  },
  { id: '9',  desktop: '/hero/hero-9.jpg',  mobile: '/hero/hero-9-mobile.jpg'  },
  { id: '10', desktop: '/hero/hero-10.jpg', mobile: '/hero/hero-10-mobile.jpg' },
  { id: '11', desktop: '/hero/hero-11.jpg', mobile: '/hero/hero-11-mobile.jpg' },
  { id: '12', desktop: '/hero/hero-12.jpg', mobile: '/hero/hero-12-mobile.jpg' },
  { id: '13', desktop: '/hero/hero-13.jpg' },
  { id: '14', desktop: '/hero/hero-14.jpg' },
]

export async function readHeroImages(): Promise<HeroImage[]> {
  const saved = await readKV<HeroImage[]>('hero_images', [])
  return saved.length > 0 ? saved : DEFAULT_HERO_IMAGES
}
export async function writeHeroImages(images: HeroImage[]): Promise<void> { return writeKV('hero_images', images) }

// ── Reports ───────────────────────────────────────────────────────────────────
export async function readReports(): Promise<Report[]>          { return readKV<Report[]>('reports', []) }
export async function writeReports(r: Report[]): Promise<void>  { return writeKV('reports', r) }

// ── Opening Hours ─────────────────────────────────────────────────────────────
export type DaySchedule = {
  open: string
  close: string
  closed: boolean
  breakStart?: string
  breakEnd?: string
}
export type OpeningHours = {
  mon: DaySchedule
  tue: DaySchedule
  wed: DaySchedule
  thu: DaySchedule
  fri: DaySchedule
  sat: DaySchedule
  sun: DaySchedule
  forceStatus: 'open' | 'closed' | null
}

const DEFAULT_OPENING_HOURS: OpeningHours = {
  mon: { open: '09:00', close: '18:00', closed: false },
  tue: { open: '09:00', close: '18:00', closed: false },
  wed: { open: '09:00', close: '18:00', closed: false },
  thu: { open: '09:00', close: '18:00', closed: false },
  fri: { open: '09:00', close: '18:00', closed: false },
  sat: { open: '09:00', close: '18:00', closed: false },
  sun: { open: '09:00', close: '18:00', closed: false },
  forceStatus: null,
}

export async function readOpeningHours(): Promise<OpeningHours> {
  return readKV<OpeningHours>('opening_hours', DEFAULT_OPENING_HOURS)
}
export async function writeOpeningHours(h: OpeningHours): Promise<void> { return writeKV('opening_hours', h) }

// ── Weekly PINs ───────────────────────────────────────────────────────────────
export type WeeklyPinEntry = { week: number; startDate: string; endDate: string; pin: string }
export async function readWeeklyPins(): Promise<WeeklyPinEntry[]>         { return readKV<WeeklyPinEntry[]>('weekly_pins', []) }
export async function writeWeeklyPins(p: WeeklyPinEntry[]): Promise<void> { return writeKV('weekly_pins', p) }

// ── Predefined Routes ──────────────────────────────────────────────────────────
export async function readPredefinedRoutes(): Promise<unknown[]>       { return readKV<unknown[]>('predefined_routes', []) }
export async function writePredefinedRoutes(r: unknown[]): Promise<void> { return writeKV('predefined_routes', r) }

// ── Interest Pins (map discovery pins) ────────────────────────────────────────
import type { InterestPin } from './interest-pins'
import { DEFAULT_PINS } from './interest-pins'

export async function readInterestPins(): Promise<InterestPin[]> {
  const pins = await readKV<InterestPin[]>('interest_pins', [])
  if (!pins || pins.length === 0) return DEFAULT_PINS
  return pins
}
export async function writeInterestPins(p: InterestPin[]): Promise<void> { return writeKV('interest_pins', p) }
