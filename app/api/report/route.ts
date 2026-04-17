import { NextResponse } from 'next/server'
import { readReports, writeReports, type Report } from '@/lib/data-server'
import { randomUUID } from 'crypto'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { bikeNumber, lat, lng, note } = body

    if (!bikeNumber || !/^\d{1,4}$/.test(bikeNumber)) {
      return NextResponse.json({ error: 'Invalid bike number' }, { status: 400 })
    }
    const num = parseInt(bikeNumber, 10)
    if (num < 1 || num > 1200) {
      return NextResponse.json({ error: 'Bike number out of range' }, { status: 400 })
    }

    const report: Report = {
      id: randomUUID(),
      bikeNumber: bikeNumber.padStart(4, '0'),
      lat: typeof lat === 'number' ? lat : null,
      lng: typeof lng === 'number' ? lng : null,
      note: typeof note === 'string' ? note.slice(0, 40) : '',
      createdAt: new Date().toISOString(),
      resolved: false,
    }

    const reports = readReports()
    reports.unshift(report)
    writeReports(reports)

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
