import { NextRequest, NextResponse } from 'next/server'
import { readPredefinedRoutes, writePredefinedRoutes } from '@/lib/data-server'

export async function GET() {
  try {
    return NextResponse.json(await readPredefinedRoutes())
  } catch {
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const routes = await readPredefinedRoutes()
    const newRoute = {
      id: `route-${Date.now()}`,
      name:        { de: body.nameDe,        en: body.nameEn        },
      description: { de: body.descriptionDe, en: body.descriptionEn },
      distance:    body.distance  || '',
      duration:    body.duration  || '',
      difficulty:  body.difficulty || 'easy',
      emoji:       body.emoji     || '🚲',
      end:       [parseFloat(body.endLat), parseFloat(body.endLng)],
      waypoints: Array.isArray(body.waypoints) ? body.waypoints : [],
    }
    routes.push(newRoute)
    await writePredefinedRoutes(routes)
    return NextResponse.json(newRoute)
  } catch {
    return NextResponse.json({ error: 'Failed to create route' }, { status: 500 })
  }
}
