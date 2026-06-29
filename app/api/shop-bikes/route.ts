import { NextResponse } from 'next/server'
import { readShopBikes } from '@/lib/data-server'

export async function GET() {
  return NextResponse.json(await readShopBikes())
}
