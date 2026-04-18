import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, writeFileSync, renameSync, existsSync, unlinkSync } from 'fs'
import { join } from 'path'

const FILE = join(process.cwd(), 'data', 'predefined-routes.json')

function read(): unknown[] {
  try {
    const raw = readFileSync(FILE, 'utf-8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}
function write(data: unknown) {
  const tmp = FILE + '.tmp'
  try {
    writeFileSync(tmp, JSON.stringify(data, null, 2))
    renameSync(tmp, FILE)
  } catch (err) {
    if (existsSync(tmp)) { try { unlinkSync(tmp) } catch {} }
    throw err
  }
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
