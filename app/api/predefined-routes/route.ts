import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET() {
  try {
    const raw = readFileSync(join(process.cwd(), 'data', 'predefined-routes.json'), 'utf-8')
    const data = JSON.parse(raw)
    return NextResponse.json(Array.isArray(data) ? data : [], {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch {
    return NextResponse.json([], {
      headers: { 'Cache-Control': 'no-store' },
    })
  }
}
