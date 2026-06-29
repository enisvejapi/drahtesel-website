import { NextResponse } from 'next/server'
import { readPredefinedRoutes } from '@/lib/data-server'

export async function GET() {
  try {
    return NextResponse.json(await readPredefinedRoutes(), {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch {
    return NextResponse.json([], {
      headers: { 'Cache-Control': 'no-store' },
    })
  }
}
