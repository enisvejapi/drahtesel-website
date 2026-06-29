'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Upload, Trash2, GripVertical, Plus, Save, Image as ImageIcon } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'

type HeroImage = { id: string; desktop: string; mobile?: string }

async function uploadFile(file: File): Promise<string> {
  const fd = new FormData()
  fd.append('file', file)
  const res = await fetch('/api/admin/shop-bikes/upload', { method: 'POST', body: fd })
  if (!res.ok) throw new Error('Upload failed')
  const { url } = await res.json()
  return url
}

function ImageUploadBox({
  label, value, onChange,
}: { label: string; value: string; onChange: (url: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadFile(file)
      onChange(url)
    } catch { alert('Upload failed') }
    setUploading(false)
    e.target.value = ''
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
      <div className="flex items-center gap-2">
        {value ? (
          <div className="relative w-20 h-14 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 bg-gray-50">
            <Image src={value} alt="" fill className="object-cover" unoptimized />
          </div>
        ) : (
          <div className="w-20 h-14 rounded-lg border border-dashed border-gray-300 flex items-center justify-center flex-shrink-0 bg-gray-50">
            <ImageIcon size={18} className="text-gray-300" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <input
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red/50"
            placeholder="URL oder hochladen..."
          />
        </div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold px-3 py-2 rounded-lg transition-colors flex-shrink-0 disabled:opacity-50"
        >
          <Upload size={12} />
          {uploading ? '…' : 'Upload'}
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
    </div>
  )
}

export default function AdminHeroImagesPage() {
  const [images, setImages] = useState<HeroImage[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/hero-images')
      .then(r => r.json())
      .then(data => { setImages(data); setLoading(false) })
  }, [])

  function updateImage(id: string, key: keyof HeroImage, value: string) {
    setImages(prev => prev.map(img => img.id === id ? { ...img, [key]: value } : img))
  }

  function removeImage(id: string) {
    setImages(prev => prev.filter(img => img.id !== id))
  }

  function addImage() {
    setImages(prev => [...prev, { id: uuidv4(), desktop: '', mobile: '' }])
  }

  function moveImage(from: number, to: number) {
    if (to < 0 || to >= images.length) return
    const next = [...images]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    setImages(next)
  }

  async function handleSave() {
    setSaving(true)
    const filtered = images.filter(img => img.desktop.trim())
    const res = await fetch('/api/admin/hero-images', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filtered),
    })
    setSaving(false)
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2000) }
  }

  if (loading) {
    return (
      <div className="p-8 text-gray-400 text-sm">Lade Hero-Bilder…</div>
    )
  }

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Hero-Bilder</h1>
          <p className="text-sm text-gray-400 mt-0.5">Bilder für die Slideshow auf der Startseite verwalten</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-brand-red text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-brand-red-dark transition-colors disabled:opacity-50"
        >
          <Save size={14} />
          {saved ? 'Gespeichert ✓' : saving ? 'Speichern…' : 'Speichern'}
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {images.map((img, i) => (
          <div key={img.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <div className="flex items-start gap-3">
              {/* Drag handle / order */}
              <div className="flex flex-col items-center gap-1 pt-1 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => moveImage(i, i - 1)}
                  disabled={i === 0}
                  className="text-gray-300 hover:text-gray-500 disabled:opacity-20 transition-colors text-xs leading-none"
                >▲</button>
                <span className="text-[10px] font-black text-gray-300">{i + 1}</span>
                <button
                  type="button"
                  onClick={() => moveImage(i, i + 1)}
                  disabled={i === images.length - 1}
                  className="text-gray-300 hover:text-gray-500 disabled:opacity-20 transition-colors text-xs leading-none"
                >▼</button>
              </div>

              {/* Fields */}
              <div className="flex-1 flex flex-col gap-3 min-w-0">
                <ImageUploadBox
                  label="Desktop-Bild (16:9)"
                  value={img.desktop}
                  onChange={v => updateImage(img.id, 'desktop', v)}
                />
                <ImageUploadBox
                  label="Mobile-Bild (9:16, optional)"
                  value={img.mobile ?? ''}
                  onChange={v => updateImage(img.id, 'mobile', v)}
                />
              </div>

              {/* Delete */}
              <button
                type="button"
                onClick={() => removeImage(img.id)}
                className="text-gray-300 hover:text-red-400 transition-colors pt-1 flex-shrink-0"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addImage}
        className="mt-4 flex items-center gap-2 text-sm text-brand-red hover:text-brand-red-dark font-semibold"
      >
        <Plus size={15} />
        Bild hinzufügen
      </button>
    </div>
  )
}
