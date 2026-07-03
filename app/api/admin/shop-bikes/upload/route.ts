import { NextResponse } from 'next/server'
import { requireAdmin, unauthorizedResponse } from '@/lib/auth-check'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function POST(request: Request) {
  try {
    await requireAdmin()
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif']
    if (!allowed.includes(ext)) return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })

    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const dir = join(process.cwd(), 'public', 'uploads', 'bikes')
    await mkdir(dir, { recursive: true })
    const bytes = await file.arrayBuffer()
    await writeFile(join(dir, filename), Buffer.from(bytes))

    return NextResponse.json({ url: `/uploads/bikes/${filename}` })
  } catch (err) {
    if ((err as Error).message === 'Unauthorized') return unauthorizedResponse()
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
