import { NextResponse } from 'next/server'
import { requireAdmin, unauthorizedResponse } from '@/lib/auth-check'
import { readFaqs, writeFaqs } from '@/lib/data-server'
import { revalidatePath } from 'next/cache'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params
    const body = await request.json()
    const items = readFaqs()
    const idx = items.findIndex((f) => f.id === id)
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    items[idx] = { ...items[idx], ...body, id }
    writeFaqs(items)
    revalidatePath('/how-it-works')
    return NextResponse.json(items[idx])
  } catch (err) {
    if ((err as Error).message === 'Unauthorized') return unauthorizedResponse()
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params
    const items = readFaqs()
    writeFaqs(items.filter((f) => f.id !== id))
    revalidatePath('/how-it-works')
    return NextResponse.json({ ok: true })
  } catch (err) {
    if ((err as Error).message === 'Unauthorized') return unauthorizedResponse()
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
