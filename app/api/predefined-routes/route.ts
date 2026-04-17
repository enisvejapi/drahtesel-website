import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET() {
  try {
    const data = JSON.parse(readFileSync(join(process.cwd(), 'data', 'predefined-routes.json'), 'utf-8'))
    return NextResponse.json(data)
  } catch {
    return NextResponse.json([], { status: 500 })
  }
}
