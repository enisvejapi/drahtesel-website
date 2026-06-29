import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { readOpeningHours, writeOpeningHours } from '@/lib/data-server'

async function isAdmin() {
  try {
    const jar = await cookies()
    const token = jar.get('admin-token')?.value
    if (!token) return false
    const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? 'dev-secret-change-in-prod')
    await jwtVerify(token, secret)
    return true
  } catch { return false }
}

export async function GET() {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const hours = await readOpeningHours()
  return NextResponse.json(hours)
}

export async function PUT(req: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  await writeOpeningHours(body)
  return NextResponse.json({ ok: true })
}
