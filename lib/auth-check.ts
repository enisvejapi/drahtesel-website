import 'server-only'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { NextResponse } from 'next/server'

function getSecret() {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET environment variable is not set')
    }
    return new TextEncoder().encode('dev-only-secret-do-not-use-in-prod')
  }
  return new TextEncoder().encode(secret)
}

export async function requireAdmin(): Promise<void> {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  if (!token) throw new Error('Unauthorized')
  await jwtVerify(token, getSecret())
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
