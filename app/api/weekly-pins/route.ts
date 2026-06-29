import { NextResponse } from 'next/server'
import { readWeeklyPins, writeWeeklyPins } from '@/lib/data-server'

// GET — return all pins (used by client to validate)
export async function GET() {
  try {
    return NextResponse.json(await readWeeklyPins(), {
      headers: { 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' },
    })
  } catch {
    return NextResponse.json([], { status: 500 })
  }
}

// POST — regenerate all 52 weekly PINs (admin only)
export async function POST() {
  try {
    const existing = await readWeeklyPins()
    // Keep existing start/end dates, just regenerate PINs
    const regenerated = existing.map((entry) => ({
      ...entry,
      pin: String(Math.floor(Math.random() * 900) + 100),
    }))
    await writeWeeklyPins(regenerated)
    return NextResponse.json(regenerated)
  } catch {
    return NextResponse.json({ error: 'Failed to regenerate' }, { status: 500 })
  }
}
