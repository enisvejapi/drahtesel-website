'use client'

import { useEffect, useState } from 'react'
import { RefreshCw, Download, FileSpreadsheet, Shield, Calendar, CheckCircle } from 'lucide-react'

interface WeeklyPin {
  week: number
  startDate: string
  endDate: string
  pin: string
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function getCurrentWeek(pins: WeeklyPin[]): WeeklyPin | null {
  const today = new Date().toISOString().split('T')[0]
  return pins.find(p => today >= p.startDate && today <= p.endDate) ?? null
}

export default function WeeklyPinsAdmin() {
  const [pins, setPins] = useState<WeeklyPin[]>([])
  const [loading, setLoading] = useState(true)
  const [regenerating, setRegenerating] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const res = await fetch('/api/weekly-pins')
    const data = await res.json()
    setPins(data)
    setLoading(false)
  }

  async function handleRegenerate() {
    if (!confirm('Alle 52 PINs neu generieren? Die alten PINs werden überschrieben.')) return
    setRegenerating(true)
    const res = await fetch('/api/weekly-pins', { method: 'POST' })
    const data = await res.json()
    setPins(data)
    setRegenerating(false)
  }

  function downloadCSV() {
    const header = 'Woche,Von,Bis,PIN\n'
    const rows = pins.map(p =>
      `${p.week},${formatDate(p.startDate)},${formatDate(p.endDate)},${p.pin}`
    ).join('\n')
    const blob = new Blob(['\uFEFF' + header + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'drahtesel-weekly-pins.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  function downloadPDF() {
    const current = getCurrentWeek(pins)
    const today = new Date().toLocaleDateString('de-DE')

    const rows = pins.map(p => {
      const isCurrent = current?.week === p.week
      return `
        <tr style="${isCurrent ? 'background:#fff5f5;font-weight:bold;' : ''}">
          <td style="padding:6px 10px;border-bottom:1px solid #eee;text-align:center;">${p.week}</td>
          <td style="padding:6px 10px;border-bottom:1px solid #eee;">${formatDate(p.startDate)}</td>
          <td style="padding:6px 10px;border-bottom:1px solid #eee;">${formatDate(p.endDate)}</td>
          <td style="padding:6px 10px;border-bottom:1px solid #eee;text-align:center;font-size:18px;letter-spacing:4px;font-weight:800;color:${isCurrent ? '#C8102E' : '#111'};">
            ${p.pin}${isCurrent ? ' ← AKTUELL' : ''}
          </td>
        </tr>`
    }).join('')

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8"/>
        <title>Drahtesel — Wöchentliche PINs</title>
        <style>
          @page { size: A4; margin: 20mm; }
          body { font-family: system-ui, sans-serif; color: #111; }
          h1 { font-size: 22px; margin-bottom: 4px; color: #C8102E; }
          .meta { font-size: 12px; color: #888; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; font-size: 13px; }
          th { background: #111; color: white; padding: 8px 10px; text-align: left; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; }
          th:nth-child(1), th:nth-child(4) { text-align: center; }
          .footer { margin-top: 20px; font-size: 10px; color: #aaa; }
          .warning { background: #fffbea; border: 1px solid #f59e0b; border-radius: 6px; padding: 10px 14px; margin-bottom: 16px; font-size: 12px; }
        </style>
      </head>
      <body>
        <h1>🔐 Drahtesel — Wöchentliche Mitarbeiter-PINs</h1>
        <p class="meta">Erstellt am ${today} · Vertraulich · Nur für Mitarbeiter</p>
        <div class="warning">
          ⚠️ Dieses Dokument ist vertraulich. Bitte sicher aufbewahren und nicht an Kunden weitergeben.<br/>
          Der PIN wechselt jeden Montag automatisch. Rot markiert = aktuelle Woche.
        </div>
        <table>
          <thead>
            <tr>
              <th>Woche</th>
              <th>Von</th>
              <th>Bis</th>
              <th>PIN</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <div class="footer">Drahtesel Fahrradverleih · Norderney · Nur für internen Gebrauch</div>
      </body>
      </html>`

    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(html)
    win.document.close()
    win.focus()
    setTimeout(() => win.print(), 400)
  }

  const current = getCurrentWeek(pins)

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Wöchentliche PINs</h1>
          <p className="text-gray-500 text-sm mt-1">Mitarbeiter-Zugangscodes für die Touren-Navigation</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={downloadCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <FileSpreadsheet size={15} /> Excel
          </button>
          <button
            onClick={downloadPDF}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Download size={15} /> PDF (A4)
          </button>
          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-red text-white text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-60"
          >
            <RefreshCw size={15} className={regenerating ? 'animate-spin' : ''} />
            {regenerating ? 'Generiert…' : 'Neu generieren'}
          </button>
        </div>
      </div>

      {/* Current week highlight */}
      {current && (
        <div className="bg-brand-red/5 border border-brand-red/20 rounded-2xl p-5 mb-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-red flex items-center justify-center flex-shrink-0">
            <Shield size={22} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-red mb-0.5">Aktueller PIN (Woche {current.week})</p>
            <p className="text-3xl font-extrabold text-gray-900 tracking-[6px]">{current.pin}</p>
            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
              <Calendar size={11} /> {formatDate(current.startDate)} – {formatDate(current.endDate)}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-green-600 text-sm font-semibold">
            <CheckCircle size={16} /> Aktiv
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-400">Woche</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-400">Von</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-400">Bis</th>
                <th className="text-center px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-400">PIN</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {pins.map(p => {
                const isCurrent = current?.week === p.week
                const isPast = p.endDate < new Date().toISOString().split('T')[0]
                return (
                  <tr key={p.week}
                    className={`border-b border-gray-50 last:border-0 ${isCurrent ? 'bg-red-50' : isPast ? 'opacity-40' : ''}`}>
                    <td className="px-4 py-3 font-semibold text-gray-500">W{p.week}</td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(p.startDate)}</td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(p.endDate)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-extrabold tracking-[4px] text-base ${isCurrent ? 'text-brand-red' : 'text-gray-800'}`}>
                        {p.pin}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {isCurrent ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                          <CheckCircle size={10} /> Aktiv
                        </span>
                      ) : isPast ? (
                        <span className="text-[11px] text-gray-400">Abgelaufen</span>
                      ) : (
                        <span className="text-[11px] text-gray-400">Zukünftig</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
