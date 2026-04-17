import { NextResponse } from 'next/server'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const PINS_FILE = join(process.cwd(), 'data', 'weekly-pins.json')

function readPins() {
  return JSON.parse(readFileSync(PINS_FILE, 'utf-8'))
}

// GET — return all pins (used by client to validate)
export async function GET() {
  try {
    return NextResponse.json(readPins())
  } catch {
    return NextResponse.json([], { status: 500 })
  }
}

// POST — regenerate all 52 weekly PINs (admin only)
export async function POST() {
  try {
    const existing = readPins()
    // Keep existing start/end dates, just regenerate PINs
    const regenerated = existing.map((entry: { week: number; startDate: string; endDate: string }) => ({
      ...entry,
      pin: String(Math.floor(Math.random() * 900) + 100),
    }))
    writeFileSync(PINS_FILE, JSON.stringify(regenerated, null, 2))
    return NextResponse.json(regenerated)
  } catch {
    return NextResponse.json({ error: 'Failed to regenerate' }, { status: 500 })
  }
}
