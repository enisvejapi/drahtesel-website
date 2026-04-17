import 'server-only'
import path from 'path'
import fs from 'fs'

export type Review = { id: string; name: string; date: string; rating: number; text: string; source: string }
export type Faq = { id: string; question: string; answer: string }
export type Settings = {
  passwordHash: string | null
}

const DATA_DIR = path.join(process.cwd(), 'data')

function readJson<T>(filename: string, fallback: T): T {
  const filePath = path.join(DATA_DIR, filename)
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(content) as T
  } catch {
    return fallback
  }
}

function writeJson<T>(filename: string, data: T): void {
  fs.mkdirSync(DATA_DIR, { recursive: true })
  const filePath = path.join(DATA_DIR, filename)
  const tmp = filePath + '.tmp'
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf-8')
  fs.renameSync(tmp, filePath) // atomic write
}

// Reviews
export function readReviews(): Review[] { return readJson<Review[]>('reviews.json', []) }
export function writeReviews(reviews: Review[]): void { writeJson('reviews.json', reviews) }

// FAQs
export function readFaqs(): Faq[] { return readJson<Faq[]>('faqs.json', []) }
export function writeFaqs(faqs: Faq[]): void { writeJson('faqs.json', faqs) }

// Settings
export function readSettings(): Settings {
  return readJson<Settings>('settings.json', { passwordHash: null })
}
export function writeSettings(settings: Settings): void { writeJson('settings.json', settings) }

// Reports
export type Report = {
  id: string
  bikeNumber: string
  lat: number | null
  lng: number | null
  note: string
  createdAt: string
  resolved: boolean
}
export function readReports(): Report[] { return readJson<Report[]>('reports.json', []) }
export function writeReports(reports: Report[]): void { writeJson('reports.json', reports) }
