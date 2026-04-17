import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { NextResponse } from 'next/server'
import type { POI } from '@/lib/pois'

const POIS_FILE = join(process.cwd(), 'public', 'tour-pois.json')

function readPOIs(): POI[] {
  try {
    return JSON.parse(readFileSync(POIS_FILE, 'utf-8'))
  } catch {
    return []
  }
}

function writePOIs(pois: POI[]) {
  writeFileSync(POIS_FILE, JSON.stringify(pois, null, 2))
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const tourId = searchParams.get('tourId')
  const all = readPOIs()
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
  const all = readPOIs()
  all.push(poi)
  writePOIs(all)
  return NextResponse.json(poi)
}

export async function DELETE(req: Request) {
  const { id } = await req.json()
  const all = readPOIs().filter(p => p.id !== id)
  writePOIs(all)
  return NextResponse.json({ ok: true })
}
