import { NextResponse } from 'next/server'
import { SignJWT } from 'jose'
import { readSettings } from '@/lib/data-server'
import { verifyPassword } from '@/lib/auth'

function getSecret() {
  return new TextEncoder().encode(process.env.JWT_SECRET ?? 'fallback-secret-change-me')
}

export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Password required' }, { status: 400 })
    }

    // Rate limiting simulation — always delay slightly to deter brute force
    await new Promise((r) => setTimeout(r, 300))

    const settings = readSettings()
    let valid = false

    if (settings.passwordHash) {
      // Check against hashed password stored in settings.json
      valid = await verifyPassword(password, settings.passwordHash)
    } else {
      // Fall back to env variable (plain text for initial setup)
      valid = password === process.env.ADMIN_PASSWORD
    }

    if (!valid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    const token = await new SignJWT({ role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(getSecret())

    const response = NextResponse.json({ ok: true })
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24,
      path: '/',
    })
    return response
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
