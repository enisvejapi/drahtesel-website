import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const FILE = join(process.cwd(), 'data', 'predefined-routes.json')

function read() {
  return JSON.parse(readFileSync(FILE, 'utf-8'))
}
function write(data: unknown) {
  writeFileSync(FILE, JSON.stringify(data, null, 2))
}

export async function GET() {
  try {
    return NextResponse.json(read())
  } catch {
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const routes = read()
    const newRoute = {
      id: `route-${Date.now()}`,
      name:        { de: body.nameDe,        en: body.nameEn        },
      description: { de: body.descriptionDe, en: body.descriptionEn },
      distance:    body.distance  || '',
      duration:    body.duration  || '',
      difficulty:  body.difficulty || 'easy',
      emoji:       body.emoji     || '🚲',
      start: [parseFloat(body.startLat), parseFloat(body.startLng)],
      end:   [parseFloat(body.endLat),   parseFloat(body.endLng)  ],
    }
    routes.push(newRoute)
    write(routes)
    return NextResponse.json(newRoute)
  } catch {
    return NextResponse.json({ error: 'Failed to create route' }, { status: 500 })
  }
}
