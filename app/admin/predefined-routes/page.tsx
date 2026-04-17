'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Plus, Pencil, Trash2, X, Check, MapPin } from 'lucide-react'

const RouteMapPicker = dynamic(() => import('@/components/admin/RouteMapPicker'), { ssr: false })

interface PredefinedRoute {
  id: string
  name: { de: string; en: string }
  description: { de: string; en: string }
  distance: string
  duration: string
  difficulty: string
  emoji: string
  start: [number, number]
  end: [number, number]
}

const EMPTY_FORM = {
  nameDe: '', nameEn: '',
  descriptionDe: '', descriptionEn: '',
  distance: '', duration: '',
  difficulty: 'easy',
  emoji: '🚲',
  startLat: '', startLng: '',
  endLat: '', endLng: '',
}

const EMOJIS = ['🚲','🏮','🏖️','🌿','👨‍👩‍👧','🏔️','🌊','🦅','🌅','🏛️','⛵','🌾']

export default function PredefinedRoutesAdmin() {
  const [routes, setRoutes] = useState<PredefinedRoute[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const res = await fetch('/api/admin/predefined-routes')
    setRoutes(await res.json())
    setLoading(false)
  }

  function openAdd() {
    setForm({ ...EMPTY_FORM })
    setEditId(null)
    setShowForm(true)
  }

  function openEdit(r: PredefinedRoute) {
    setForm({
      nameDe: r.name.de, nameEn: r.name.en,
      descriptionDe: r.description.de, descriptionEn: r.description.en,
      distance: r.distance, duration: r.duration,
      difficulty: r.difficulty, emoji: r.emoji,
      startLat: String(r.start[0]), startLng: String(r.start[1]),
      endLat: String(r.end[0]),   endLng: String(r.end[1]),
    })
    setEditId(r.id)
    setShowForm(true)
  }

  async function handleSave() {
    if (!form.nameDe || !form.startLat || !form.startLng || !form.endLat || !form.endLng) return
    setSaving(true)
    const url = editId
      ? `/api/admin/predefined-routes/${editId}`
      : '/api/admin/predefined-routes'
    await fetch(url, {
      method: editId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    await load()
    setSaving(false)
    setShowForm(false)
    setEditId(null)
  }

  async function handleDelete(id: string) {
    if (!confirm('Diese Route löschen?')) return
    setDeletingId(id)
    await fetch(`/api/admin/predefined-routes/${id}`, { method: 'DELETE' })
    await load()
    setDeletingId(null)
  }

  const f = (key: keyof typeof EMPTY_FORM, val: string) =>
    setForm(prev => ({ ...prev, [key]: val }))

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Touren-Vorschläge</h1>
          <p className="text-gray-500 text-sm mt-1">Vordefinierte Fahrradrouten für die Gäste</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-brand-red text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-700 transition-colors"
        >
          <Plus size={16} /> Route hinzufügen
        </button>
      </div>

      {/* Route list */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full animate-spin" />
        </div>
      ) : routes.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4 text-3xl">🚲</div>
          <p className="text-gray-400 text-sm">Noch keine Touren. Füge deine erste Route hinzu.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {routes.map(r => (
            <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-2xl flex-shrink-0">
                  {r.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-extrabold text-gray-900 text-base leading-tight">{r.name.de}</p>
                      <p className="text-gray-400 text-xs">{r.name.en}</p>
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => openEdit(r)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        disabled={deletingId === r.id}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-brand-red transition-colors disabled:opacity-40"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-500 text-xs mt-1.5 line-clamp-2">{r.description.de}</p>
                  <div className="flex items-center gap-3 mt-2.5">
                    <span className="text-[11px] font-semibold text-gray-400">{r.distance}</span>
                    <span className="text-[11px] font-semibold text-gray-400">{r.duration}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${r.difficulty === 'easy' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {r.difficulty === 'easy' ? 'Leicht' : 'Mittel'}
                    </span>
                  </div>
                  <div className="flex gap-3 mt-2 text-[10px] text-gray-300 font-mono">
                    <span className="flex items-center gap-1"><MapPin size={9} className="text-green-500"/>A: {r.start[0].toFixed(4)}, {r.start[1].toFixed(4)}</span>
                    <span className="flex items-center gap-1"><MapPin size={9} className="text-brand-red"/>B: {r.end[0].toFixed(4)}, {r.end[1].toFixed(4)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="font-extrabold text-gray-900">{editId ? 'Route bearbeiten' : 'Neue Route hinzufügen'}</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors">
                <X size={16} />
              </button>
            </div>

            <div className="px-6 py-5 flex flex-col gap-5">

              {/* Emoji picker */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Emoji</label>
                <div className="flex flex-wrap gap-2">
                  {EMOJIS.map(e => (
                    <button key={e} onClick={() => f('emoji', e)}
                      className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${form.emoji === e ? 'bg-brand-red/10 ring-2 ring-brand-red scale-110' : 'bg-gray-50 hover:bg-gray-100'}`}>
                      {e}
                    </button>
                  ))}
                  <input
                    value={form.emoji}
                    onChange={e => f('emoji', e.target.value)}
                    className="w-10 h-10 rounded-xl border border-gray-200 text-center text-xl bg-gray-50 outline-none"
                    maxLength={2}
                    placeholder="✏️"
                  />
                </div>
              </div>

              {/* Names */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Name (DE) *</label>
                  <input value={form.nameDe} onChange={e => f('nameDe', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand-red transition-colors"
                    placeholder="Leuchtturm-Tour" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Name (EN)</label>
                  <input value={form.nameEn} onChange={e => f('nameEn', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand-red transition-colors"
                    placeholder="Lighthouse Tour" />
                </div>
              </div>

              {/* Descriptions */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Beschreibung (DE)</label>
                <textarea value={form.descriptionDe} onChange={e => f('descriptionDe', e.target.value)}
                  rows={2} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand-red transition-colors resize-none"
                  placeholder="Kurze Beschreibung auf Deutsch…" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Description (EN)</label>
                <textarea value={form.descriptionEn} onChange={e => f('descriptionEn', e.target.value)}
                  rows={2} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand-red transition-colors resize-none"
                  placeholder="Short description in English…" />
              </div>

              {/* Distance / Duration / Difficulty */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Distanz</label>
                  <input value={form.distance} onChange={e => f('distance', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand-red transition-colors"
                    placeholder="~6 km" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Dauer</label>
                  <input value={form.duration} onChange={e => f('duration', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand-red transition-colors"
                    placeholder="~25 min" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Schwierigkeit</label>
                  <select value={form.difficulty} onChange={e => f('difficulty', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand-red transition-colors bg-white">
                    <option value="easy">Leicht</option>
                    <option value="medium">Mittel</option>
                  </select>
                </div>
              </div>

              {/* Map Picker */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Start- &amp; Zielpunkt *
                </label>
                <RouteMapPicker
                  startLat={form.startLat}
                  startLng={form.startLng}
                  endLat={form.endLat}
                  endLng={form.endLng}
                  onChange={(field, val) => f(field, val)}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={() => setShowForm(false)}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors">
                Abbrechen
              </button>
              <button onClick={handleSave} disabled={saving || !form.nameDe || !form.startLat || !form.endLat}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-red text-white text-sm font-bold hover:bg-red-700 transition-colors disabled:opacity-50">
                {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Check size={15} />}
                {editId ? 'Speichern' : 'Hinzufügen'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
