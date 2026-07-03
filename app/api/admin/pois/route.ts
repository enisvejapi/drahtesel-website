import { NextResponse } from 'next/server'
import type { POI } from '@/lib/pois'
import { readKV, writeKV } from '@/lib/db'

async function readPOIs(): Promise<POI[]> {
  return readKV<POI[]>('tour_pois', [])
}

async function writePOIs(pois: POI[]) {
  await writeKV('tour_pois', pois)
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const tourId = searchParams.get('tourId')
  const all = await readPOIs()
  return NextResponse.json(tourId ? all.filter(p => p.tourId === tourId) : all)
}

export async function POST(req: Request) {
  const body = await req.json() as Omit<POI, 'id'>
  if (!body.tourId || typeof body.lat !== 'number' || typeof body.lng !== 'number') {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }
  const poi: POI = {
    ...body,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2),
  }
  const all = await readPOIs()
  all.push(poi)
  await writePOIs(all)
  return NextResponse.json(poi)
}

export async function DELETE(req: Request) {
  const { id } = await req.json()
  const all = (await readPOIs()).filter(p => p.id !== id)
  await writePOIs(all)
  return NextResponse.json({ ok: true })
}
