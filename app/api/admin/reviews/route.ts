import { NextResponse } from 'next/server'
import { requireAdmin, unauthorizedResponse } from '@/lib/auth-check'
import { readReviews, writeReviews } from '@/lib/data-server'
import { revalidatePath } from 'next/cache'
import { v4 as uuidv4 } from 'uuid'

export async function GET() {
  try {
    await requireAdmin()
    return NextResponse.json(readReviews())
  } catch { return unauthorizedResponse() }
}

export async function POST(request: Request) {
  try {
    await requireAdmin()
    const body = await request.json()
    const reviews = readReviews()
    const item = { ...body, id: uuidv4() }
    reviews.push(item)
    writeReviews(reviews)
    revalidatePath('/')
    return NextResponse.json(item, { status: 201 })
  } catch (err) {
    if ((err as Error).message === 'Unauthorized') return unauthorizedResponse()
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
