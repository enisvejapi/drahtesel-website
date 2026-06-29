import { NextRequest, NextResponse } from 'next/server'
import { readPredefinedRoutes, writePredefinedRoutes } from '@/lib/data-server'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const routes = await readPredefinedRoutes() as Array<Record<string, unknown>>
    const idx = routes.findIndex((r) => r.id === id)
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    routes[idx] = {
      ...routes[idx],
      name:        { de: body.nameDe,        en: body.nameEn        },
      description: { de: body.descriptionDe, en: body.descriptionEn },
      distance:    body.distance  || routes[idx].distance,
      duration:    body.duration  || routes[idx].duration,
      difficulty:  body.difficulty || routes[idx].difficulty,
      emoji:       body.emoji     || routes[idx].emoji,
      end:       [parseFloat(body.endLat as string), parseFloat(body.endLng as string)],
      waypoints: Array.isArray(body.waypoints) ? body.waypoints : (routes[idx].waypoints ?? []),
    }
    await writePredefinedRoutes(routes)
    return NextResponse.json(routes[idx])
  } catch {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const routes = await readPredefinedRoutes() as Array<Record<string, unknown>>
    const filtered = routes.filter((r) => r.id !== id)
    await writePredefinedRoutes(filtered)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
