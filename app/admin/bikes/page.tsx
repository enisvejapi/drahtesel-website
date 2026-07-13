'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Plus, Save, X, Trash2, ChevronDown, ChevronUp, Upload, Bike, PowerIcon } from 'lucide-react'
import type { ShopBike, ShopBikeStat, ShopBikeSpec, ShopBikeBenefit, ShopBikeFaq } from '@/lib/data-server'

// ─── empty templates ───────────────────────────────────────────────────────────
const emptyBike = (): Omit<ShopBike, 'id'> => ({
  name: '',
  subtitleDe: '', subtitleEn: '',
  badgeDe: '', badgeEn: '',
  price: '',
  accentColor: '#C8102E',
  heroImage: '', heroImageMobile: '', cardImage: '', triptychImage: '',
  descriptionDe: '', descriptionEn: '',
  colors: [''],
  stats: [
    { value: '', unit: '', labelDe: '', labelEn: '', sub: '' },
    { value: '', unit: '', labelDe: '', labelEn: '', sub: '' },
    { value: '', unit: '', labelDe: '', labelEn: '', sub: '' },
    { value: '', unit: '', labelDe: '', labelEn: '', sub: '' },
  ],
  specs: [{ keyDe: '', keyEn: '', valueDe: '', valueEn: '' }],
  highlightsDe: [''],
  highlightsEn: [''],
  benefits: [
    { n: '01', titleDe: '', titleEn: '', bodyDe: '', bodyEn: '', imgPosition: '0%' },
    { n: '02', titleDe: '', titleEn: '', bodyDe: '', bodyEn: '', imgPosition: '50%' },
    { n: '03', titleDe: '', titleEn: '', bodyDe: '', bodyEn: '', imgPosition: '100%' },
  ],
  faqsDe: [{ q: '', a: '' }],
  faqsEn: [{ q: '', a: '' }],
})

const inp = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red/50 transition-colors'
const label = (text: string) => <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">{text}</label>

// ─── image uploader ─────────────────────────────────────────────────────────────
function ImageUploader({ value, onChange, placeholder }: { value: string; onChange: (url: string) => void; placeholder: string }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/admin/shop-bikes/upload', { method: 'POST', body: fd })
    if (res.ok) {
      const { url } = await res.json()
      onChange(url)
    }
    setUploading(false)
  }

  return (
    <div className="flex items-center gap-3">
      {value ? (
        <div className="relative w-16 h-12 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
          <Image src={value} alt="" fill className="object-cover" />
        </div>
      ) : (
        <div className="w-16 h-12 rounded-lg border border-dashed border-gray-300 flex items-center justify-center flex-shrink-0">
          <Bike size={18} className="text-gray-300" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <input value={value} onChange={e => onChange(e.target.value)} className={inp} placeholder={placeholder} />
      </div>
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold px-3 py-2 rounded-lg transition-colors flex-shrink-0 disabled:opacity-50"
      >
        <Upload size={12} />
        {uploading ? 'Uploading…' : 'Upload'}
      </button>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  )
}

// ─── section wrapper ────────────────────────────────────────────────────────────
function Section({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button type="button" onClick={() => setOpen(v => !v)} className="w-full flex items-center justify-between px-5 py-3.5 bg-gray-50 hover:bg-gray-100 transition-colors text-left">
        <span className="text-sm font-bold text-gray-700">{title}</span>
        {open ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
      </button>
      {open && <div className="p-5 flex flex-col gap-4">{children}</div>}
    </div>
  )
}

// ─── main form ──────────────────────────────────────────────────────────────────
function BikeForm({ initial, onSave, onCancel, saving }: {
  initial: Omit<ShopBike, 'id'>
  onSave: (data: Omit<ShopBike, 'id'>) => void
  onCancel: () => void
  saving: boolean
}) {
  const [form, setForm] = useState<Omit<ShopBike, 'id'>>(initial)

  function set<K extends keyof typeof form>(key: K, val: (typeof form)[K]) {
    setForm(p => ({ ...p, [key]: val }))
  }

  // ── stat helpers
  function setStat(i: number, key: keyof ShopBikeStat, val: string) {
    const next = [...form.stats] as ShopBikeStat[]
    next[i] = { ...next[i], [key]: val }
    set('stats', next)
  }

  // ── spec helpers
  function setSpec(i: number, key: keyof ShopBikeSpec, val: string) {
    const next = [...form.specs] as ShopBikeSpec[]
    next[i] = { ...next[i], [key]: val }
    set('specs', next)
  }
  function addSpec() { set('specs', [...form.specs, { keyDe: '', keyEn: '', valueDe: '', valueEn: '' }]) }
  function removeSpec(i: number) { set('specs', form.specs.filter((_, j) => j !== i)) }

  // ── highlights
  function setHL(lang: 'De' | 'En', i: number, val: string) {
    const key = lang === 'De' ? 'highlightsDe' : 'highlightsEn'
    const next = [...form[key]]
    next[i] = val
    set(key, next)
  }
  function addHL(lang: 'De' | 'En') {
    const key = lang === 'De' ? 'highlightsDe' : 'highlightsEn'
    set(key, [...form[key], ''])
  }
  function removeHL(lang: 'De' | 'En', i: number) {
    const key = lang === 'De' ? 'highlightsDe' : 'highlightsEn'
    set(key, form[key].filter((_, j) => j !== i))
  }

  // ── benefits
  function setBenefit(i: number, key: keyof ShopBikeBenefit, val: string) {
    const next = [...form.benefits] as ShopBikeBenefit[]
    next[i] = { ...next[i], [key]: val }
    set('benefits', next)
  }

  // ── faqs
  function setFaq(lang: 'De' | 'En', i: number, key: 'q' | 'a', val: string) {
    const fkey = lang === 'De' ? 'faqsDe' : 'faqsEn'
    const next = [...form[fkey]] as ShopBikeFaq[]
    next[i] = { ...next[i], [key]: val }
    set(fkey, next)
  }
  function addFaq(lang: 'De' | 'En') {
    const fkey = lang === 'De' ? 'faqsDe' : 'faqsEn'
    set(fkey, [...form[fkey], { q: '', a: '' }])
  }
  function removeFaq(lang: 'De' | 'En', i: number) {
    const fkey = lang === 'De' ? 'faqsDe' : 'faqsEn'
    set(fkey, form[fkey].filter((_, j) => j !== i))
  }

  // ── colors
  function setColor(i: number, val: string) {
    const next = [...form.colors]; next[i] = val; set('colors', next)
  }

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form) }} className="flex flex-col gap-3">

      {/* Basic */}
      <Section title="Grundinfo" defaultOpen>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            {label('Modellname')}
            <input value={form.name} onChange={e => set('name', e.target.value)} className={inp} placeholder="Giant Stormguard E+ 1" required />
          </div>
          <div>{label('Untertitel DE')}<input value={form.subtitleDe} onChange={e => set('subtitleDe', e.target.value)} className={inp} placeholder="CUES Edition 2024" /></div>
          <div>{label('Untertitel EN')}<input value={form.subtitleEn} onChange={e => set('subtitleEn', e.target.value)} className={inp} placeholder="CUES Edition 2024" /></div>
          <div>{label('Badge DE')}<input value={form.badgeDe} onChange={e => set('badgeDe', e.target.value)} className={inp} placeholder="E-Trekking" /></div>
          <div>{label('Badge EN')}<input value={form.badgeEn} onChange={e => set('badgeEn', e.target.value)} className={inp} placeholder="E-Trekking" /></div>
          <div>{label('Preis (nur Zahl, z.B. 5.899)')}<input value={form.price} onChange={e => set('price', e.target.value)} className={inp} placeholder="5.899" required /></div>
          <div>{label('Akzentfarbe')}<input type="color" value={form.accentColor} onChange={e => set('accentColor', e.target.value)} className="h-9 w-full rounded-lg border border-gray-200 p-1 cursor-pointer" /></div>
        </div>
        <div>
          {label('Farben (eine pro Zeile)')}
          {form.colors.map((c, i) => (
            <div key={i} className="flex gap-2 mb-1.5">
              <input value={c} onChange={e => setColor(i, e.target.value)} className={inp} placeholder="Blue Dragonfly" />
              {form.colors.length > 1 && <button type="button" onClick={() => set('colors', form.colors.filter((_, j) => j !== i))} className="text-gray-300 hover:text-red-400"><X size={14} /></button>}
            </div>
          ))}
          <button type="button" onClick={() => set('colors', [...form.colors, ''])} className="text-xs text-brand-red hover:text-brand-red-dark font-semibold mt-1">+ Farbe hinzufügen</button>
        </div>
        <div>{label('Beschreibung DE')}<textarea rows={3} value={form.descriptionDe} onChange={e => set('descriptionDe', e.target.value)} className={inp} /></div>
        <div>{label('Beschreibung EN')}<textarea rows={3} value={form.descriptionEn} onChange={e => set('descriptionEn', e.target.value)} className={inp} /></div>
      </Section>

      {/* Images */}
      <Section title="Bilder">
        <div>{label('Hero-Bild Desktop (Vollbild-Hintergrund)')}<ImageUploader value={form.heroImage} onChange={v => set('heroImage', v)} placeholder="/stormguard-hero.png" /></div>
        <div>{label('Hero-Bild Mobile (optional, Portrait-Format 9:16)')}<ImageUploader value={form.heroImageMobile ?? ''} onChange={v => set('heroImageMobile', v)} placeholder="/stormguard-hero-mobile.jpg" /></div>
        <div>{label('Produktbild (Karte rechts)')}<ImageUploader value={form.cardImage} onChange={v => set('cardImage', v)} placeholder="/stormguard-side.png" /></div>
        <div>{label('Triptychon-Bild (3 Karten Hintergrund)')}<ImageUploader value={form.triptychImage} onChange={v => set('triptychImage', v)} placeholder="/stormguard-triptych.png" /></div>
      </Section>

      {/* Stats */}
      <Section title="Statistiken (4 Kennzahlen)">
        {form.stats.map((s, i) => (
          <div key={i} className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-3 bg-gray-50 rounded-xl">
            <div>{label('Wert')}<input value={s.value} onChange={e => setStat(i, 'value', e.target.value)} className={inp} placeholder="85" /></div>
            <div>{label('Einheit')}<input value={s.unit} onChange={e => setStat(i, 'unit', e.target.value)} className={inp} placeholder="Nm" /></div>
            <div>{label('Label DE')}<input value={s.labelDe} onChange={e => setStat(i, 'labelDe', e.target.value)} className={inp} placeholder="Drehmoment" /></div>
            <div>{label('Label EN')}<input value={s.labelEn} onChange={e => setStat(i, 'labelEn', e.target.value)} className={inp} placeholder="Torque" /></div>
            <div>{label('Subtext')}<input value={s.sub} onChange={e => setStat(i, 'sub', e.target.value)} className={inp} placeholder="Yamaha SyncDrive" /></div>
          </div>
        ))}
      </Section>

      {/* Specs */}
      <Section title="Technische Daten">
        {form.specs.map((s, i) => (
          <div key={i} className="grid grid-cols-2 sm:grid-cols-4 gap-2 items-end">
            <div>{label('Schlüssel DE')}<input value={s.keyDe} onChange={e => setSpec(i, 'keyDe', e.target.value)} className={inp} placeholder="Motor" /></div>
            <div>{label('Schlüssel EN')}<input value={s.keyEn} onChange={e => setSpec(i, 'keyEn', e.target.value)} className={inp} placeholder="Motor" /></div>
            <div>{label('Wert DE')}<input value={s.valueDe} onChange={e => setSpec(i, 'valueDe', e.target.value)} className={inp} placeholder="85 Nm Yamaha" /></div>
            <div className="flex gap-2 items-end">
              <div className="flex-1">{label('Wert EN')}<input value={s.valueEn} onChange={e => setSpec(i, 'valueEn', e.target.value)} className={inp} placeholder="85 Nm Yamaha" /></div>
              <button type="button" onClick={() => removeSpec(i)} className="mb-0.5 text-gray-300 hover:text-red-400 pb-2"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        <button type="button" onClick={addSpec} className="text-xs text-brand-red hover:text-brand-red-dark font-semibold">+ Zeile hinzufügen</button>
      </Section>

      {/* Highlights */}
      <Section title="Highlights">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            {label('Highlights DE')}
            {form.highlightsDe.map((h, i) => (
              <div key={i} className="flex gap-2 mb-1.5">
                <input value={h} onChange={e => setHL('De', i, e.target.value)} className={inp} placeholder="Carbon-Riemenantrieb..." />
                {form.highlightsDe.length > 1 && <button type="button" onClick={() => removeHL('De', i)} className="text-gray-300 hover:text-red-400"><X size={14} /></button>}
              </div>
            ))}
            <button type="button" onClick={() => addHL('De')} className="text-xs text-brand-red font-semibold mt-1">+ Hinzufügen</button>
          </div>
          <div>
            {label('Highlights EN')}
            {form.highlightsEn.map((h, i) => (
              <div key={i} className="flex gap-2 mb-1.5">
                <input value={h} onChange={e => setHL('En', i, e.target.value)} className={inp} placeholder="Carbon belt drive..." />
                {form.highlightsEn.length > 1 && <button type="button" onClick={() => removeHL('En', i)} className="text-gray-300 hover:text-red-400"><X size={14} /></button>}
              </div>
            ))}
            <button type="button" onClick={() => addHL('En')} className="text-xs text-brand-red font-semibold mt-1">+ Add</button>
          </div>
        </div>
      </Section>

      {/* Benefits */}
      <Section title="Vorteile (3 Karten)">
        {form.benefits.map((b, i) => (
          <div key={i} className="p-4 bg-gray-50 rounded-xl">
            <p className="text-xs font-bold text-gray-400 uppercase mb-3">Karte {b.n}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>{label('Titel DE')}<input value={b.titleDe} onChange={e => setBenefit(i, 'titleDe', e.target.value)} className={inp} /></div>
              <div>{label('Titel EN')}<input value={b.titleEn} onChange={e => setBenefit(i, 'titleEn', e.target.value)} className={inp} /></div>
              <div>{label('Text DE')}<textarea rows={2} value={b.bodyDe} onChange={e => setBenefit(i, 'bodyDe', e.target.value)} className={inp} /></div>
              <div>{label('Text EN')}<textarea rows={2} value={b.bodyEn} onChange={e => setBenefit(i, 'bodyEn', e.target.value)} className={inp} /></div>
              <div className="sm:col-span-2">{label('Eigenes Bild für diese Karte (empfohlen)')}<ImageUploader value={b.imgSrc ?? ''} onChange={v => setBenefit(i, 'imgSrc', v)} placeholder="Eigenes Bild hochladen..." /></div>
              <div>{label('Bildposition Fallback (0%, 50%, 100%)')}<input value={b.imgPosition ?? ''} onChange={e => setBenefit(i, 'imgPosition', e.target.value)} className={inp} placeholder="50%" /></div>
            </div>
          </div>
        ))}
      </Section>

      {/* FAQ */}
      <Section title="FAQ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {label('FAQ Deutsch')}
            {form.faqsDe.map((f, i) => (
              <div key={i} className="mb-3 p-3 bg-gray-50 rounded-xl">
                <div className="flex justify-between mb-1">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Frage {i + 1}</span>
                  {form.faqsDe.length > 1 && <button type="button" onClick={() => removeFaq('De', i)} className="text-gray-300 hover:text-red-400"><X size={12} /></button>}
                </div>
                <input value={f.q} onChange={e => setFaq('De', i, 'q', e.target.value)} className={`${inp} mb-1.5`} placeholder="Frage..." />
                <textarea rows={2} value={f.a} onChange={e => setFaq('De', i, 'a', e.target.value)} className={inp} placeholder="Antwort..." />
              </div>
            ))}
            <button type="button" onClick={() => addFaq('De')} className="text-xs text-brand-red font-semibold">+ Frage hinzufügen</button>
          </div>
          <div>
            {label('FAQ English')}
            {form.faqsEn.map((f, i) => (
              <div key={i} className="mb-3 p-3 bg-gray-50 rounded-xl">
                <div className="flex justify-between mb-1">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Question {i + 1}</span>
                  {form.faqsEn.length > 1 && <button type="button" onClick={() => removeFaq('En', i)} className="text-gray-300 hover:text-red-400"><X size={12} /></button>}
                </div>
                <input value={f.q} onChange={e => setFaq('En', i, 'q', e.target.value)} className={`${inp} mb-1.5`} placeholder="Question..." />
                <textarea rows={2} value={f.a} onChange={e => setFaq('En', i, 'a', e.target.value)} className={inp} placeholder="Answer..." />
              </div>
            ))}
            <button type="button" onClick={() => addFaq('En')} className="text-xs text-brand-red font-semibold">+ Add question</button>
          </div>
        </div>
      </Section>

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <button type="submit" disabled={saving} className="flex items-center gap-2 bg-brand-red text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-brand-red-dark transition-colors disabled:opacity-50">
          <Save size={14} /> {saving ? 'Speichern…' : 'Speichern'}
        </button>
        <button type="button" onClick={onCancel} className="flex items-center gap-2 text-gray-500 text-sm px-5 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
          <X size={14} /> Abbrechen
        </button>
      </div>
    </form>
  )
}

// ─── page ───────────────────────────────────────────────────────────────────────
export default function AdminBikesPage() {
  const [bikes, setBikes] = useState<ShopBike[]>([])
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [shopActive, setShopActive] = useState(true)
  const [toggling, setToggling] = useState(false)

  useEffect(() => {
    fetch('/api/admin/shop-bikes').then(r => r.json()).then(setBikes)
    fetch('/api/admin/shop-status').then(r => r.json()).then(d => setShopActive(d.active))
  }, [])

  async function toggleShop() {
    setToggling(true)
    const res = await fetch('/api/admin/shop-status', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !shopActive }),
    })
    if (res.ok) setShopActive(v => !v)
    setToggling(false)
  }

  async function handleAdd(data: Omit<ShopBike, 'id'>) {
    setSaving(true)
    const res = await fetch('/api/admin/shop-bikes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    if (res.ok) {
      const item = await res.json()
      setBikes(p => [...p, item])
      setAdding(false)
    }
    setSaving(false)
  }

  async function handleEdit(id: string, data: Omit<ShopBike, 'id'>) {
    setSaving(true)
    const res = await fetch(`/api/admin/shop-bikes/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    if (res.ok) {
      const item = await res.json()
      setBikes(p => p.map(b => b.id === id ? item : b))
      setEditing(null)
    }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    setDeleting(id)
    const res = await fetch(`/api/admin/shop-bikes/${id}`, { method: 'DELETE' })
    if (res.ok) setBikes(p => p.filter(b => b.id !== id))
    setDeleting(null)
  }

  return (
    <div>
      {/* Shop Status Toggle */}
      <div className={`flex items-center justify-between p-4 rounded-2xl border mb-6 transition-colors ${shopActive ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
        <div className="flex items-center gap-3">
          <div className={`w-2.5 h-2.5 rounded-full ${shopActive ? 'bg-green-500' : 'bg-red-400'} ${shopActive ? 'animate-pulse' : ''}`} />
          <div>
            <p className={`font-bold text-sm ${shopActive ? 'text-green-800' : 'text-red-800'}`}>
              Shop {shopActive ? 'aktiv' : 'deaktiviert'}
            </p>
            <p className={`text-xs ${shopActive ? 'text-green-600' : 'text-red-500'}`}>
              {shopActive ? '/pricing ist sichtbar und zugänglich' : '/pricing zeigt „Coming Soon" Overlay'}
            </p>
          </div>
        </div>
        <button
          onClick={toggleShop}
          disabled={toggling}
          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-60 ${shopActive ? 'bg-green-500' : 'bg-gray-300'}`}
        >
          <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${shopActive ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shop — Fahrräder</h1>
          <p className="text-gray-400 text-sm mt-0.5">{bikes.length} Modell{bikes.length !== 1 ? 'e' : ''} · erscheinen als Slider auf /pricing</p>
        </div>
        {!adding && (
          <button onClick={() => { setAdding(true); setEditing(null) }} className="flex items-center gap-2 bg-brand-red hover:bg-brand-red-dark text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors">
            <Plus size={15} /> Fahrrad hinzufügen
          </button>
        )}
      </div>

      {/* Add form */}
      {adding && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <h2 className="font-bold text-gray-800 mb-5">Neues Fahrrad</h2>
          <BikeForm initial={emptyBike()} onSave={handleAdd} onCancel={() => setAdding(false)} saving={saving} />
        </div>
      )}

      {/* Bike list */}
      <div className="flex flex-col gap-4">
        {bikes.length === 0 && !adding && (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
            <Bike size={32} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">Noch keine Fahrräder.</p>
            <p className="text-gray-300 text-sm mt-1">Klicke auf „Fahrrad hinzufügen" um anzufangen.</p>
          </div>
        )}

        {bikes.map(bike => (
          <div key={bike.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {editing === bike.id ? (
              <div className="p-6">
                <h2 className="font-bold text-gray-800 mb-5">Bearbeiten: {bike.name}</h2>
                <BikeForm
                  initial={bike}
                  onSave={data => handleEdit(bike.id, data)}
                  onCancel={() => setEditing(null)}
                  saving={saving}
                />
              </div>
            ) : (
              <div className="flex items-center gap-4 p-4">
                {/* Thumbnail */}
                <div className="relative w-20 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  {bike.cardImage
                    ? <Image src={bike.cardImage} alt={bike.name} fill className="object-cover" />
                    : <div className="w-full h-full flex items-center justify-center"><Bike size={20} className="text-gray-300" /></div>
                  }
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: bike.accentColor }} />
                    <p className="font-bold text-gray-900 truncate">{bike.name}</p>
                    <span className="text-xs bg-gray-100 text-gray-500 font-semibold px-2 py-0.5 rounded-full flex-shrink-0">{bike.badgeDe}</span>
                  </div>
                  <p className="text-gray-400 text-sm">€&thinsp;{bike.price} · {bike.subtitleDe}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => { setEditing(bike.id); setAdding(false) }} className="text-xs text-brand-red hover:text-brand-red-dark font-bold transition-colors px-3 py-1.5 rounded-lg hover:bg-brand-red/5">
                    Bearbeiten
                  </button>
                  <button onClick={() => handleDelete(bike.id)} disabled={deleting === bike.id} className="text-gray-300 hover:text-red-400 transition-colors disabled:opacity-40 p-1.5">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
