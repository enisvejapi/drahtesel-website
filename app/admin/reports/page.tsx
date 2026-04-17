'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, MapPin, CheckCircle2, Trash2, ExternalLink, RefreshCw } from 'lucide-react'

type Report = {
  id: string
  bikeNumber: string
  lat: number | null
  lng: number | null
  note: string
  createdAt: string
  resolved: boolean
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState<string | null>(null)

  async function fetchReports() {
    setLoading(true)
    const res = await fetch('/api/admin/reports')
    if (res.ok) setReports(await res.json())
    setLoading(false)
  }

  useEffect(() => { fetchReports() }, [])

  async function toggleResolved(report: Report) {
    setActionId(report.id)
    await fetch('/api/admin/reports', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: report.id, resolved: !report.resolved }),
    })
    setReports((prev) =>
      prev.map((r) => r.id === report.id ? { ...r, resolved: !r.resolved } : r)
    )
    setActionId(null)
  }

  async function deleteReport(id: string) {
    if (!confirm('Meldung wirklich löschen?')) return
    setActionId(id)
    await fetch(`/api/admin/reports?id=${id}`, { method: 'DELETE' })
    setReports((prev) => prev.filter((r) => r.id !== id))
    setActionId(null)
  }

  const open = reports.filter((r) => !r.resolved)
  const resolved = reports.filter((r) => r.resolved)

  function formatDate(iso: string) {
    const d = new Date(iso)
    return d.toLocaleString('de-DE', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  function mapsUrl(lat: number, lng: number) {
    return `https://www.google.com/maps?q=${lat},${lng}`
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pannenmeldungen</h1>
          <p className="text-gray-500 text-sm mt-1">
            Eingehende Hilfsanfragen von Kunden
          </p>
        </div>
        <div className="flex items-center gap-3">
          {open.length > 0 && (
            <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-700 text-sm font-semibold px-3 py-1.5 rounded-full">
              <AlertTriangle size={14} />
              {open.length} offen
            </span>
          )}
          <button
            onClick={fetchReports}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 border border-gray-200 hover:border-gray-300 rounded-lg px-3 py-1.5 transition-colors"
          >
            <RefreshCw size={14} />
            Aktualisieren
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Lädt…</div>
      ) : reports.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl">
          <CheckCircle2 size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">Keine Meldungen vorhanden</p>
          <p className="text-gray-400 text-sm">Eingegangene Pannenhilfen erscheinen hier.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Open reports */}
          {open.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Offen ({open.length})
              </h2>
              <div className="flex flex-col gap-3">
                {open.map((r) => (
                  <ReportCard
                    key={r.id}
                    report={r}
                    actionId={actionId}
                    onToggle={toggleResolved}
                    onDelete={deleteReport}
                    formatDate={formatDate}
                    mapsUrl={mapsUrl}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Resolved reports */}
          {resolved.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Erledigt ({resolved.length})
              </h2>
              <div className="flex flex-col gap-3 opacity-60">
                {resolved.map((r) => (
                  <ReportCard
                    key={r.id}
                    report={r}
                    actionId={actionId}
                    onToggle={toggleResolved}
                    onDelete={deleteReport}
                    formatDate={formatDate}
                    mapsUrl={mapsUrl}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ReportCard({
  report, actionId, onToggle, onDelete, formatDate, mapsUrl,
}: {
  report: Report
  actionId: string | null
  onToggle: (r: Report) => void
  onDelete: (id: string) => void
  formatDate: (iso: string) => string
  mapsUrl: (lat: number, lng: number) => string
}) {
  const busy = actionId === report.id

  return (
    <div className={`bg-white border rounded-xl p-5 flex flex-col sm:flex-row sm:items-start gap-4 shadow-sm ${
      report.resolved ? 'border-gray-200' : 'border-red-200 ring-1 ring-red-100'
    }`}>
      {/* Bike number badge */}
      <div className={`flex-shrink-0 w-16 h-16 rounded-xl flex flex-col items-center justify-center font-mono font-bold text-xl ${
        report.resolved ? 'bg-gray-100 text-gray-500' : 'bg-red-50 text-brand-red'
      }`}>
        <span className="text-xs font-sans font-medium text-gray-400 leading-none mb-0.5">Nr.</span>
        {report.bikeNumber}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="text-xs text-gray-400">{formatDate(report.createdAt)}</span>
          {report.resolved && (
            <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
              <CheckCircle2 size={10} /> Erledigt
            </span>
          )}
        </div>

        {report.note && (
          <p className="text-gray-800 text-sm leading-snug mb-2">{report.note}</p>
        )}

        {report.lat !== null && report.lng !== null ? (
          <a
            href={mapsUrl(report.lat, report.lng)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            <MapPin size={12} />
            Standort in Google Maps
            <ExternalLink size={11} />
          </a>
        ) : (
          <span className="text-xs text-gray-400 italic">Kein Standort übermittelt</span>
        )}
      </div>

      {/* Actions */}
      <div className="flex sm:flex-col gap-2 flex-shrink-0">
        <button
          onClick={() => onToggle(report)}
          disabled={busy}
          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-50 ${
            report.resolved
              ? 'border-gray-200 text-gray-500 hover:border-gray-300'
              : 'border-green-200 text-green-700 hover:bg-green-50'
          }`}
        >
          <CheckCircle2 size={13} />
          {report.resolved ? 'Wieder öffnen' : 'Erledigt'}
        </button>
        <button
          onClick={() => onDelete(report.id)}
          disabled={busy}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors disabled:opacity-50"
        >
          <Trash2 size={13} />
          Löschen
        </button>
      </div>
    </div>
  )
}
