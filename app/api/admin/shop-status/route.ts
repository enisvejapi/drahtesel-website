import { NextResponse } from 'next/server'
import { requireAdmin, unauthorizedResponse } from '@/lib/auth-check'
import { readShopStatus, writeShopStatus } from '@/lib/data-server'

export async function GET() {
  const active = await readShopStatus()
  return NextResponse.json({ active })
}

export async function PUT(req: Request) {
  try {
    await requireAdmin()
    const { active } = await req.json()
    await writeShopStatus(Boolean(active))
    return NextResponse.json({ active: Boolean(active) })
  } catch {
    return unauthorizedResponse()
  }
}
