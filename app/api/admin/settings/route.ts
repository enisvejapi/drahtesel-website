import { NextResponse } from 'next/server'
import { requireAdmin, unauthorizedResponse } from '@/lib/auth-check'
import { readSettings, writeSettings } from '@/lib/data-server'
import { hashPassword } from '@/lib/auth'

export async function GET() {
  try {
    await requireAdmin()
    const settings = readSettings()
    return NextResponse.json({
      passwordHash: settings.passwordHash ? '***set***' : null,
    })
  } catch { return unauthorizedResponse() }
}

export async function POST(request: Request) {
  try {
    await requireAdmin()
    const body = await request.json()
    const settings = readSettings()

    if (body.newPassword && typeof body.newPassword === 'string' && body.newPassword.length >= 8) {
      settings.passwordHash = await hashPassword(body.newPassword)
    }

    writeSettings(settings)
    return NextResponse.json({ ok: true })
  } catch (err) {
    if ((err as Error).message === 'Unauthorized') return unauthorizedResponse()
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
