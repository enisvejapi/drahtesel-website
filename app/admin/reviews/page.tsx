'use client'

import { useState, useEffect } from 'react'
import { Star, Plus, Save, X, Trash2 } from 'lucide-react'

type Review = { id: string; name: string; date: string; rating: number; text: string; source: string }
type ReviewForm = { name: string; date: string; rating: number; text: string; source: string }

const emptyReview: ReviewForm = { name: '', date: '', rating: 5, text: '', source: 'Google' }

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [editing, setEditing] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState<ReviewForm>({ ...emptyReview })
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/reviews').then((r) => r.json()).then(setReviews)
  }, [])

  async function handleSave(id?: string) {
    setSaving(true)
    const url = id ? `/api/admin/reviews/${id}` : '/api/admin/reviews'
    const method = id ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) {
      const data = await res.json()
      if (id) setReviews((prev) => prev.map((r) => (r.id === id ? data : r)))
      else setReviews((prev) => [...prev, data])
      setEditing(null)
      setAdding(false)
      setForm({ ...emptyReview })
    }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    setDeleting(id)
    const res = await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' })
    if (res.ok) setReviews((prev) => prev.filter((r) => r.id !== id))
    setDeleting(null)
  }

  function startEdit(review: Review) {
    setEditing(review.id)
    setAdding(false)
    setForm({ name: review.name, date: review.date, rating: review.rating, text: review.text, source: review.source })
  }

  const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent'

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
          <p className="text-gray-500 text-sm mt-1">{reviews.length} reviews</p>
        </div>
        {!adding && (
          <button onClick={() => { setAdding(true); setEditing(null); setForm({ ...emptyReview }) }} className="flex items-center gap-2 bg-brand-red hover:bg-brand-red-dark text-white font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors">
            <Plus size={16} /> Add Review
          </button>
        )}
      </div>

      {/* Add form */}
      {adding && (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-5">
          <h2 className="font-semibold text-gray-900 mb-4">New Review</h2>
          <ReviewFormFields form={form} setForm={setForm} inputClass={inputClass} />
          <div className="flex gap-2 mt-4">
            <button onClick={() => handleSave()} disabled={saving} className="flex items-center gap-2 bg-brand-red text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-brand-red-dark transition-colors disabled:opacity-50">
              <Save size={14} /> {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => setAdding(false)} className="flex items-center gap-2 text-gray-500 text-sm px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors">
              <X size={14} /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            {editing === review.id ? (
              <>
                <ReviewFormFields form={form} setForm={setForm} inputClass={inputClass} />
                <div className="flex gap-2 mt-4">
                  <button onClick={() => handleSave(review.id)} disabled={saving} className="flex items-center gap-2 bg-brand-red text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-brand-red-dark transition-colors disabled:opacity-50">
                    <Save size={14} /> {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button onClick={() => setEditing(null)} className="flex items-center gap-2 text-gray-500 text-sm px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors">
                    <X size={14} /> Cancel
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">{review.name}</span>
                    <span className="text-gray-400 text-sm">·</span>
                    <span className="text-gray-500 text-sm">{review.date}</span>
                    <div className="flex">
                      {[1,2,3,4,5].map((i) => <Star key={i} size={12} className={i <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'} />)}
                    </div>
                    <span className="text-xs text-gray-400">{review.source}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">&ldquo;{review.text}&rdquo;</p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button onClick={() => startEdit(review)} className="text-xs text-brand-red hover:text-brand-red-dark font-semibold transition-colors">Edit</button>
                  <button onClick={() => handleDelete(review.id)} disabled={deleting === review.id} className="text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 size={14} />
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

function ReviewFormFields({ form, setForm, inputClass }: { form: ReviewForm; setForm: React.Dispatch<React.SetStateAction<ReviewForm>>; inputClass: string }) {
  const update = (key: keyof ReviewForm, val: string | number) => setForm((p) => ({ ...p, [key]: val }))
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div><label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Name</label><input value={String(form.name)} onChange={(e) => update('name', e.target.value)} className={inputClass} placeholder="Customer name" /></div>
      <div><label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Date</label><input value={String(form.date)} onChange={(e) => update('date', e.target.value)} className={inputClass} placeholder="March 2026" /></div>
      <div><label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Rating (1–5)</label><input type="number" min="1" max="5" value={Number(form.rating)} onChange={(e) => update('rating', Number(e.target.value))} className={inputClass} /></div>
      <div><label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Source</label><input value={String(form.source)} onChange={(e) => update('source', e.target.value)} className={inputClass} placeholder="Google" /></div>
      <div className="sm:col-span-2"><label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Review Text</label><textarea rows={3} value={String(form.text)} onChange={(e) => update('text', e.target.value)} className={inputClass} placeholder="Review content..." /></div>
    </div>
  )
}
