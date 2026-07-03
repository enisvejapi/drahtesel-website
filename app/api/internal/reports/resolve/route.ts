import { NextResponse } from 'next/server'
import { readReports, writeReports } from '@/lib/data-server'

export async function POST(req: Request) {
  const secret = req.headers.get('x-internal-secret')
  if (!secret || secret !== process.env.INTERNAL_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const reports = (await readReports()).map((r) =>
      r.id === id ? { ...r, resolved: true } : r
    )
    await writeReports(reports)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
