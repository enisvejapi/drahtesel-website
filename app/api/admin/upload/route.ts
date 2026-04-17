import { NextResponse } from 'next/server'
import { requireAdmin, unauthorizedResponse } from '@/lib/auth-check'
import path from 'path'
import fs from 'fs'

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
    const dir = path.join(process.cwd(), 'public', 'pin-images')
    fs.mkdirSync(dir, { recursive: true })

    const bytes = await file.arrayBuffer()
    fs.writeFileSync(path.join(dir, filename), Buffer.from(bytes))

    return NextResponse.json({ url: `/pin-images/${filename}` })
  } catch (err) {
    if ((err as Error).message === 'Unauthorized') return unauthorizedResponse()
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
