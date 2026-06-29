import { NextResponse } from 'next/server'
import { requireAdmin, unauthorizedResponse } from '@/lib/auth-check'
import { readShopBikes, writeShopBikes } from '@/lib/data-server'
import { revalidatePath } from 'next/cache'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params
    const body = await request.json()
    const bikes = await readShopBikes()
    const idx = bikes.findIndex(b => b.id === id)
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    bikes[idx] = { ...bikes[idx], ...body, id }
    await writeShopBikes(bikes)
    revalidatePath('/pricing')
    return NextResponse.json(bikes[idx])
  } catch (err) {
    if ((err as Error).message === 'Unauthorized') return unauthorizedResponse()
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params
    const bikes = await readShopBikes()
    const filtered = bikes.filter(b => b.id !== id)
    if (filtered.length === bikes.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    await writeShopBikes(filtered)
    revalidatePath('/pricing')
    return NextResponse.json({ ok: true })
  } catch (err) {
    if ((err as Error).message === 'Unauthorized') return unauthorizedResponse()
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
