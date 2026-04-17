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

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const routes = read()
    const idx = routes.findIndex((r: { id: string }) => r.id === params.id)
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    routes[idx] = {
      ...routes[idx],
      name:        { de: body.nameDe,        en: body.nameEn        },
      description: { de: body.descriptionDe, en: body.descriptionEn },
      distance:    body.distance  || routes[idx].distance,
      duration:    body.duration  || routes[idx].duration,
      difficulty:  body.difficulty || routes[idx].difficulty,
      emoji:       body.emoji     || routes[idx].emoji,
      start: [parseFloat(body.startLat), parseFloat(body.startLng)],
      end:   [parseFloat(body.endLat),   parseFloat(body.endLng)  ],
    }
    write(routes)
    return NextResponse.json(routes[idx])
  } catch {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const routes = read()
    const filtered = routes.filter((r: { id: string }) => r.id !== params.id)
    write(filtered)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
