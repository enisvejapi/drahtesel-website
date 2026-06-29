'use client'

import { useEffect, useState } from 'react'
import { Clock, Save, AlertCircle, CheckCircle, Plus, X } from 'lucide-react'
import type { OpeningHours, DaySchedule } from '@/lib/data-server'
import OpeningHoursWidget from '@/components/OpeningHoursWidget'

const DAYS: { key: keyof Omit<OpeningHours, 'forceStatus'>; label: string }[] = [
  { key: 'mon', label: 'Montag'     },
  { key: 'tue', label: 'Dienstag'   },
  { key: 'wed', label: 'Mittwoch'   },
  { key: 'thu', label: 'Donnerstag' },
  { key: 'fri', label: 'Freitag'    },
  { key: 'sat', label: 'Samstag'    },
  { key: 'sun', label: 'Sonntag'    },
]

const DEFAULT: OpeningHours = {
  mon: { open: '09:00', close: '18:00', closed: false },
  tue: { open: '09:00', close: '18:00', closed: false },
  wed: { open: '09:00', close: '18:00', closed: false },
  thu: { open: '09:00', close: '18:00', closed: false },
  fri: { open: '09:00', close: '18:00', closed: false },
  sat: { open: '09:00', close: '18:00', closed: false },
  sun: { open: '09:00', close: '18:00', closed: false },
  forceStatus: null,
}

export default function OpeningHoursPage() {
  const [hours, setHours]   = useState<OpeningHours>(DEFAULT)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [toast, setToast]     = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  useEffect(() => {
    fetch('/api/admin/opening-hours')
      .then(r => r.json())
      .then(data => { setHours({ ...DEFAULT, ...data }); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  function updateDay(day: keyof Omit<OpeningHours, 'forceStatus'>, field: keyof DaySchedule, value: string | boolean) {
    setHours(prev => ({ ...prev, [day]: { ...prev[day], [field]: value } }))
  }

  function addBreak(day: keyof Omit<OpeningHours, 'forceStatus'>) {
    setHours(prev => ({ ...prev, [day]: { ...prev[day], breakStart: '13:00', breakEnd: '15:00' } }))
  }

  function removeBreak(day: keyof Omit<OpeningHours, 'forceStatus'>) {
    setHours(prev => {
      const { breakStart, breakEnd, ...rest } = prev[day]
      return { ...prev, [day]: rest }
    })
  }

  async function save() {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/opening-hours', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hours),
      })
      if (!res.ok) throw new Error()
      setToast({ type: 'success', msg: 'Öffnungszeiten gespeichert!' })
    } catch {
      setToast({ type: 'error', msg: 'Fehler beim Speichern.' })
    } finally {
      setSaving(false)
      setTimeout(() => setToast(null), 3000)
    }
  }

  if (loading) return <div className="p-8 text-gray-400">Lädt…</div>

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-brand-red/10 flex items-center justify-center">
          <Clock size={20} className="text-brand-red" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Öffnungszeiten</h1>
          <p className="text-sm text-gray-400">Wird live auf der Homepage angezeigt</p>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">

        {/* ── Left: editor ── */}
        <div className="flex-1 min-w-0">

          {/* Force override */}
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-5 mb-6">
            <div className="text-sm font-semibold text-white mb-1">Status-Override</div>
            <p className="text-xs text-gray-400 mb-4">Überschreibt die normalen Zeiten — z.B. für Feiertage.</p>
            <div className="flex gap-3">
              {(['open', 'closed', null] as const).map((val) => (
                <button
                  key={String(val)}
                  onClick={() => setHours(prev => ({ ...prev, forceStatus: val }))}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                    hours.forceStatus === val
                      ? val === 'open'
                        ? 'bg-green-500/20 border-green-500/50 text-green-400'
                        : val === 'closed'
                        ? 'bg-red-500/20 border-red-500/50 text-red-400'
                        : 'bg-white/10 border-white/20 text-white'
                      : 'bg-transparent border-white/10 text-gray-500 hover:border-white/20'
                  }`}
                >
                  {val === 'open' ? '● Immer geöffnet' : val === 'closed' ? '● Immer geschlossen' : 'Automatisch'}
                </button>
              ))}
            </div>
          </div>

          {/* Per-day schedule */}
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden mb-6">
            <div className="px-5 py-3 border-b border-white/10 text-sm font-semibold text-white">Wochentage</div>
            {DAYS.map(({ key, label }, i) => {
              const day = hours[key]
              const hasBreak = !!day.breakStart
              return (
                <div key={key} className={`px-5 py-4 ${i < DAYS.length - 1 ? 'border-b border-white/5' : ''}`}>
                  <div className="flex items-center gap-4">
                    {/* Day name */}
                    <div className="w-28 text-sm text-gray-300 font-medium flex-shrink-0">{label}</div>

                    {/* Open/closed toggle */}
                    <label className="flex items-center gap-2 cursor-pointer flex-shrink-0">
                      <div
                        onClick={() => updateDay(key, 'closed', !day.closed)}
                        className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${day.closed ? 'bg-red-500/40' : 'bg-green-500/40'}`}
                      >
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${day.closed ? 'left-0.5 bg-red-400' : 'left-5 bg-green-400'}`} />
                      </div>
                      <span className={`text-xs font-medium ${day.closed ? 'text-red-400' : 'text-green-400'}`}>
                        {day.closed ? 'Geschlossen' : 'Geöffnet'}
                      </span>
                    </label>

                    {/* Times */}
                    {!day.closed && (
                      <div className="flex items-center gap-2 ml-auto">
                        <input
                          type="time"
                          value={day.open}
                          onChange={e => updateDay(key, 'open', e.target.value)}
                          className="bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-sm text-white focus:outline-none focus:border-brand-red"
                        />
                        <span className="text-gray-500 text-sm">–</span>
                        <input
                          type="time"
                          value={day.close}
                          onChange={e => updateDay(key, 'close', e.target.value)}
                          className="bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-sm text-white focus:outline-none focus:border-brand-red"
                        />
                      </div>
                    )}
                  </div>

                  {/* Break row */}
                  {!day.closed && (
                    <div className="mt-2 ml-[7.5rem]">
                      {hasBreak ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 flex-shrink-0">Pause:</span>
                          <input
                            type="time"
                            value={day.breakStart ?? ''}
                            onChange={e => updateDay(key, 'breakStart', e.target.value)}
                            className="bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-brand-red"
                          />
                          <span className="text-gray-500 text-xs">–</span>
                          <input
                            type="time"
                            value={day.breakEnd ?? ''}
                            onChange={e => updateDay(key, 'breakEnd', e.target.value)}
                            className="bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-brand-red"
                          />
                          <button
                            onClick={() => removeBreak(key)}
                            className="text-gray-600 hover:text-red-400 transition-colors"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addBreak(key)}
                          className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-300 transition-colors"
                        >
                          <Plus size={11} /> Pause hinzufügen
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Save */}
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2 bg-brand-red hover:bg-brand-red-dark text-white font-bold px-6 py-3 rounded-xl transition-all disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? 'Speichern…' : 'Speichern'}
          </button>
        </div>

        {/* ── Right: live widget preview ── */}
        <div className="xl:w-72 flex-shrink-0">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Vorschau — wie es auf der Homepage aussieht</div>
          <div className="bg-[#111] rounded-2xl p-6 border border-white/5">
            <OpeningHoursWidget hours={hours} />
          </div>
        </div>

      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium shadow-xl z-50 ${
          toast.type === 'success' ? 'bg-green-500/20 border border-green-500/40 text-green-300' : 'bg-red-500/20 border border-red-500/40 text-red-300'
        }`}>
          {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {toast.msg}
        </div>
      )}
    </div>
  )
}
