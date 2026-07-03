import { NextResponse } from 'next/server'
import { requireAdmin, unauthorizedResponse } from '@/lib/auth-check'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function POST(req: Request) {
  try {
    await requireAdmin()

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

    const ext = (file.name.split('.').pop() ?? 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '')
    const allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif']
    if (!allowed.includes(ext)) {
      return NextResponse.json({ error: 'File type not allowed' }, { status: 400 })
    }

    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const dir = join(process.cwd(), 'public', 'uploads', 'pin-images')
    await mkdir(dir, { recursive: true })
    const bytes = await file.arrayBuffer()
    await writeFile(join(dir, filename), Buffer.from(bytes))

    return NextResponse.json({ url: `/uploads/pin-images/${filename}` })
  } catch (err) {
    if ((err as Error).message === 'Unauthorized') return unauthorizedResponse()
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
