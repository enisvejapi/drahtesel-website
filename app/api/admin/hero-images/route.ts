import { NextResponse } from 'next/server'
import { requireAdmin, unauthorizedResponse } from '@/lib/auth-check'
import { readHeroImages, writeHeroImages } from '@/lib/data-server'
import { revalidatePath } from 'next/cache'

export async function GET() {
  try {
    await requireAdmin()
    return NextResponse.json(await readHeroImages())
  } catch { return unauthorizedResponse() }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin()
    const body = await request.json()
    await writeHeroImages(body)
    revalidatePath('/')
    return NextResponse.json({ ok: true })
  } catch (err) {
    if ((err as Error).message === 'Unauthorized') return unauthorizedResponse()
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
