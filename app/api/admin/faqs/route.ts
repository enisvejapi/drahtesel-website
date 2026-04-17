import { NextResponse } from 'next/server'
import { requireAdmin, unauthorizedResponse } from '@/lib/auth-check'
import { readFaqs, writeFaqs } from '@/lib/data-server'
import { revalidatePath } from 'next/cache'
import { v4 as uuidv4 } from 'uuid'

export async function GET() {
  try {
    await requireAdmin()
    return NextResponse.json(readFaqs())
  } catch { return unauthorizedResponse() }
}

export async function POST(request: Request) {
  try {
    await requireAdmin()
    const body = await request.json()
    const items = readFaqs()
    const item = { ...body, id: uuidv4() }
    items.push(item)
    writeFaqs(items)
    revalidatePath('/how-it-works')
    return NextResponse.json(item, { status: 201 })
  } catch (err) {
    if ((err as Error).message === 'Unauthorized') return unauthorizedResponse()
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
