import { NextResponse } from 'next/server'
import { requireAdmin, unauthorizedResponse } from '@/lib/auth-check'
import { readInterestPins, writeInterestPins } from '@/lib/data-server'
import type { InterestPin } from '@/lib/interest-pins'
import { randomUUID } from 'crypto'

export async function GET() {
  try {
    await requireAdmin()
    return NextResponse.json(await readInterestPins())
  } catch { return unauthorizedResponse() }
}

export async function POST(req: Request) {
  try {
    await requireAdmin()
    const body = await req.json()
    const pins = await readInterestPins()
    const pin: InterestPin = { ...body, id: body.id || randomUUID() }
    const existing = pins.findIndex(p => p.id === pin.id)
    if (existing >= 0) {
      pins[existing] = pin
    } else {
      pins.push(pin)
    }
    await writeInterestPins(pins)
    return NextResponse.json(pin)
  } catch { return unauthorizedResponse() }
}

export async function DELETE(req: Request) {
  try {
    await requireAdmin()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    const pins = (await readInterestPins()).filter(p => p.id !== id)
    await writeInterestPins(pins)
    return NextResponse.json({ ok: true })
  } catch { return unauthorizedResponse() }
}
