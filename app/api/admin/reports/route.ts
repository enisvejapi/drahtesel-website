import { NextResponse } from 'next/server'
import { requireAdmin, unauthorizedResponse } from '@/lib/auth-check'
import { readReports, writeReports } from '@/lib/data-server'

export async function GET() {
  try {
    await requireAdmin()
    return NextResponse.json(await readReports())
  } catch { return unauthorizedResponse() }
}

export async function DELETE(req: Request) {
  try {
    await requireAdmin()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    const reports = (await readReports()).filter((r) => r.id !== id)
    await writeReports(reports)
    return NextResponse.json({ ok: true })
  } catch { return unauthorizedResponse() }
}

export async function PATCH(req: Request) {
  try {
    await requireAdmin()
    const { id, resolved } = await req.json()
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    const reports = (await readReports()).map((r) => r.id === id ? { ...r, resolved } : r)
    await writeReports(reports)
    return NextResponse.json({ ok: true })
  } catch { return unauthorizedResponse() }
}
