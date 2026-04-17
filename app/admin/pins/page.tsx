'use client'

import { useEffect, useState, useRef } from 'react'
import { Plus, Trash2, MapPin, Save, X, Loader2, Upload, Image as ImageIcon } from 'lucide-react'
import type { InterestPin, PinCategory } from '@/lib/interest-pins'
import { PIN_CATEGORIES, DEFAULT_PINS } from '@/lib/interest-pins'

const CATEGORIES = Object.entries(PIN_CATEGORIES) as [PinCategory, typeof PIN_CATEGORIES[PinCategory]][]

const EMPTY: Omit<InterestPin, 'id'> = {
  title: { de: '', en: '' },
  description: { de: '', en: '' },
  tip: { de: '', en: '' },
  category: 'landmark',
  lat: 53.7080,
  lng: 7.1700,
  image: undefined,
  images: [],
}

export default function AdminPinsPage() {
  const [pins, setPins] = useState<InterestPin[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<InterestPin | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [uploadingMain, setUploadingMain] = useState(false)
  const [uploadingSub, setUploadingSub] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const leafletMapRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerRef = useRef<any>(null)
  const mainImageInputRef = useRef<HTMLInputElement>(null)
  const subImageInputRef = useRef<HTMLInputElement>(null)

  async function load() {
    setLoading(true)
    const res = await fetch('/api/admin/pins')
    if (res.ok) setPins(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  // Mini Leaflet map for coordinate picking
  useEffect(() => {
    if (!editing || !mapRef.current) return
    if (leafletMapRef.current) return

    import('leaflet').then((L) => {
      if (!mapRef.current || leafletMapRef.current) return

      if (!document.querySelector('link[href*="leaflet@1.9.4"]')) {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(link)
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })

      const map = L.map(mapRef.current, { center: [editing.lat, editing.lng], zoom: 13 })
      leafletMapRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap', maxZoom: 19,
      }).addTo(map)

      markerRef.current = L.marker([editing.lat, editing.lng], { draggable: true }).addTo(map)
      markerRef.current.on('dragend', () => {
        const { lat, lng } = markerRef.current.getLatLng()
        setEditing(prev => prev ? { ...prev, lat, lng } : prev)
      })

      map.on('click', (e: { latlng: { lat: number; lng: number } }) => {
        const { lat, lng } = e.latlng
        markerRef.current?.setLatLng([lat, lng])
        setEditing(prev => prev ? { ...prev, lat, lng } : prev)
      })
    })

    return () => {
      if (leafletMapRef.current) { leafletMapRef.current.remove(); leafletMapRef.current = null; markerRef.current = null }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!editing])

  async function uploadFile(file: File): Promise<string | null> {
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    if (!res.ok) return null
    const data = await res.json()
    return data.url as string
  }

  async function handleMainImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !editing) return
    setUploadingMain(true)
    const url = await uploadFile(file)
    if (url) setEditing(prev => prev ? { ...prev, image: url } : prev)
    setUploadingMain(false)
    e.target.value = ''
  }

  async function handleSubImagesUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length || !editing) return
    setUploadingSub(true)
    const urls: string[] = []
    for (const file of files) {
      const url = await uploadFile(file)
      if (url) urls.push(url)
    }
    setEditing(prev => prev ? { ...prev, images: [...(prev.images ?? []), ...urls] } : prev)
    setUploadingSub(false)
    e.target.value = ''
  }

  function removeSubImage(idx: number) {
    setEditing(prev => prev ? { ...prev, images: (prev.images ?? []).filter((_, i) => i !== idx) } : prev)
  }

  function startNew() {
    setEditing({ id: crypto.randomUUID(), ...EMPTY })
  }

  function startEdit(pin: InterestPin) {
    if (leafletMapRef.current) { leafletMapRef.current.remove(); leafletMapRef.current = null }
    setEditing({ ...pin, images: pin.images ?? [] })
  }

  async function handleSave() {
    if (!editing) return
    setSaving(true)
    await fetch('/api/admin/pins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing),
    })
    await load()
    setEditing(null)
    setSaving(false)
    if (leafletMapRef.current) { leafletMapRef.current.remove(); leafletMapRef.current = null }
  }

  async function handleDelete(id: string) {
    if (!confirm('Pin wirklich löschen?')) return
    setDeleting(id)
    await fetch(`/api/admin/pins?id=${id}`, { method: 'DELETE' })
    await load()
    setDeleting(null)
  }

  function cancelEdit() {
    setEditing(null)
    if (leafletMapRef.current) { leafletMapRef.current.remove(); leafletMapRef.current = null }
  }

  async function loadDefaults() {
    if (!confirm('Standard-Pins laden?')) return
    for (const pin of DEFAULT_PINS) {
      await fetch('/api/admin/pins', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(pin) })
    }
    await load()
  }

  const inp = 'w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/40 focus:border-brand-red bg-white'

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Entdeckungs-Pins</h1>
          <p className="text-gray-500 text-sm mt-1">Interessante Orte — mit Bildern, Beschreibungen und GPS-Koordinaten</p>
        </div>
        <div className="flex gap-2">
          {pins.length === 0 && (
            <button onClick={loadDefaults} className="text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl px-4 py-2 hover:border-gray-300 transition-colors">
              Standard-Pins laden
            </button>
          )}
          <button onClick={startNew} className="flex items-center gap-2 bg-brand-red text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-red-700 transition-colors">
            <Plus size={16} /> Neuer Pin
          </button>
        </div>
      </div>

      {/* ── Edit form ────────────────────────────────────────────────────────── */}
      {editing && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm mb-6 overflow-hidden">
          {/* Form header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">{pins.find(p => p.id === editing.id) ? 'Pin bearbeiten' : 'Neuer Pin'}</h2>
            <button onClick={cancelEdit} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"><X size={18} /></button>
          </div>

          <div className="p-6 space-y-6">
            {/* Images section */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Bilder</label>
              <div className="flex gap-4 flex-wrap">
                {/* Main image */}
                <div className="flex-shrink-0">
                  <p className="text-xs text-gray-400 font-semibold mb-1.5">Hauptbild</p>
                  <input ref={mainImageInputRef} type="file" accept="image/*" className="hidden" onChange={handleMainImageUpload} />
                  {editing.image ? (
                    <div className="relative w-40 h-28 rounded-xl overflow-hidden border border-gray-200 group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={editing.image} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                        <button onClick={() => mainImageInputRef.current?.click()} className="p-1.5 bg-white rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                          <Upload size={14} />
                        </button>
                        <button onClick={() => setEditing(prev => prev ? { ...prev, image: undefined } : prev)} className="p-1.5 bg-white rounded-lg text-red-500 hover:bg-red-50 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => mainImageInputRef.current?.click()}
                      disabled={uploadingMain}
                      className="w-40 h-28 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-brand-red hover:text-brand-red transition-colors"
                    >
                      {uploadingMain ? <Loader2 size={20} className="animate-spin" /> : <><ImageIcon size={20} /><span className="text-xs font-semibold">Bild hochladen</span></>}
                    </button>
                  )}
                </div>

                {/* Sub images */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 font-semibold mb-1.5">Weitere Bilder (Galerie)</p>
                  <input ref={subImageInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleSubImagesUpload} />
                  <div className="flex flex-wrap gap-2">
                    {(editing.images ?? []).map((url, idx) => (
                      <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 group flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button
                          onClick={() => removeSubImage(idx)}
                          className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => subImageInputRef.current?.click()}
                      disabled={uploadingSub}
                      className="w-20 h-20 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-brand-red hover:text-brand-red transition-colors flex-shrink-0"
                    >
                      {uploadingSub ? <Loader2 size={16} className="animate-spin" /> : <><Plus size={16} /><span className="text-[10px] font-bold">Hinzufügen</span></>}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Text fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Titel (DE)"><input value={editing.title.de} onChange={e => setEditing({ ...editing, title: { ...editing.title, de: e.target.value } })} className={inp} /></Field>
              <Field label="Title (EN)"><input value={editing.title.en} onChange={e => setEditing({ ...editing, title: { ...editing.title, en: e.target.value } })} className={inp} /></Field>
              <Field label="Beschreibung (DE)"><textarea rows={3} value={editing.description.de} onChange={e => setEditing({ ...editing, description: { ...editing.description, de: e.target.value } })} className={`${inp} resize-none`} /></Field>
              <Field label="Description (EN)"><textarea rows={3} value={editing.description.en} onChange={e => setEditing({ ...editing, description: { ...editing.description, en: e.target.value } })} className={`${inp} resize-none`} /></Field>
              <Field label="Tipp (DE)"><input value={editing.tip.de} onChange={e => setEditing({ ...editing, tip: { ...editing.tip, de: e.target.value } })} className={inp} /></Field>
              <Field label="Tip (EN)"><input value={editing.tip.en} onChange={e => setEditing({ ...editing, tip: { ...editing.tip, en: e.target.value } })} className={inp} /></Field>
            </div>

            {/* Category */}
            <Field label="Kategorie">
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(([key, cat]) => (
                  <button
                    key={key}
                    onClick={() => setEditing({ ...editing, category: key })}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold border-2 transition-all"
                    style={editing.category === key
                      ? { borderColor: cat.color, backgroundColor: `${cat.color}15`, color: cat.color }
                      : { borderColor: '#e5e7eb', color: '#6b7280' }
                    }
                  >
                    {cat.emoji} {cat.label.de}
                  </button>
                ))}
              </div>
            </Field>

            {/* Map */}
            <Field label="Standort — klicke auf die Karte oder ziehe den Marker">
              <div className="flex gap-3 mb-2">
                <input type="number" step="0.0001" value={editing.lat} onChange={e => { const lat = parseFloat(e.target.value); setEditing({ ...editing, lat }); markerRef.current?.setLatLng([lat, editing.lng]); leafletMapRef.current?.setView([lat, editing.lng]) }} className={`${inp} flex-1`} placeholder="Lat" />
                <input type="number" step="0.0001" value={editing.lng} onChange={e => { const lng = parseFloat(e.target.value); setEditing({ ...editing, lng }); markerRef.current?.setLatLng([editing.lat, lng]); leafletMapRef.current?.setView([editing.lat, lng]) }} className={`${inp} flex-1`} placeholder="Lng" />
              </div>
              <div ref={mapRef} className="w-full h-56 rounded-xl border border-gray-200 overflow-hidden" />
            </Field>

            {/* Actions */}
            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <button onClick={handleSave} disabled={saving || !editing.title.de} className="flex items-center gap-2 bg-brand-red text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors">
                {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                Speichern
              </button>
              <button onClick={cancelEdit} className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-800 border border-gray-200 px-5 py-2.5 rounded-xl transition-colors">
                <X size={15} /> Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Pin list ─────────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">Lädt…</div>
      ) : pins.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl">
          <MapPin size={36} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium mb-1">Noch keine Pins</p>
          <p className="text-gray-400 text-sm">Erstelle deinen ersten Pin oder lade die Standard-Pins.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pins.map(pin => {
            const cat = PIN_CATEGORIES[pin.category]
            return (
              <div key={pin.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                {/* Image or color band */}
                <div className="relative h-36 overflow-hidden">
                  {pin.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={pin.image} alt={pin.title.de} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl" style={{ background: `linear-gradient(135deg, ${cat.color}22, ${cat.color}44)` }}>
                      {cat.emoji}
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: cat.color }}>
                      {cat.label.de}
                    </span>
                  </div>
                  {pin.images && pin.images.length > 0 && (
                    <div className="absolute top-2 right-2 bg-black/50 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      +{pin.images.length} Foto{pin.images.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="font-bold text-gray-900 text-sm mb-1 truncate">{pin.title.de}</div>
                  <div className="text-xs text-gray-400 font-mono mb-3">{pin.lat.toFixed(4)}, {pin.lng.toFixed(4)}</div>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(pin)} className="flex-1 text-xs font-bold text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300 px-3 py-1.5 rounded-lg transition-colors">
                      Bearbeiten
                    </button>
                    <button onClick={() => handleDelete(pin.id)} disabled={deleting === pin.id} className="p-1.5 text-gray-300 hover:text-red-500 border border-gray-100 hover:border-red-200 rounded-lg transition-colors">
                      {deleting === pin.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Field({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
      {children}
    </div>
  )
}
