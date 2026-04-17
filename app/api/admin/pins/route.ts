import { NextResponse } from 'next/server'
import { requireAdmin, unauthorizedResponse } from '@/lib/auth-check'
import path from 'path'
import fs from 'fs'
import { DEFAULT_PINS } from '@/lib/interest-pins'
import type { InterestPin } from '@/lib/interest-pins'
import { randomUUID } from 'crypto'

const FILE = path.join(process.cwd(), 'public', 'interest-pins.json')

function readPins(): InterestPin[] {
  try {
    const raw = fs.readFileSync(FILE, 'utf-8')
    const parsed = JSON.parse(raw)
    // If the file is empty array, return defaults
    if (Array.isArray(parsed) && parsed.length === 0) return DEFAULT_PINS
    return Array.isArray(parsed) ? parsed : DEFAULT_PINS
  } catch {
    return DEFAULT_PINS
  }
}

function writePins(pins: InterestPin[]) {
  const tmp = FILE + '.tmp'
  fs.writeFileSync(tmp, JSON.stringify(pins, null, 2), 'utf-8')
  fs.renameSync(tmp, FILE)
}

export async function GET() {
  try {
    await requireAdmin()
    return NextResponse.json(readPins())
  } catch { return unauthorizedResponse() }
}

export async function POST(req: Request) {
  try {
    await requireAdmin()
    const body = await req.json()
    const pins = readPins()
    const pin: InterestPin = { ...body, id: body.id || randomUUID() }
    const existing = pins.findIndex(p => p.id === pin.id)
    if (existing >= 0) {
      pins[existing] = pin
    } else {
      pins.push(pin)
    }
    writePins(pins)
    return NextResponse.json(pin)
  } catch { return unauthorizedResponse() }
}

export async function DELETE(req: Request) {
  try {
    await requireAdmin()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    writePins(readPins().filter(p => p.id !== id))
    return NextResponse.json({ ok: true })
  } catch { return unauthorizedResponse() }
}
