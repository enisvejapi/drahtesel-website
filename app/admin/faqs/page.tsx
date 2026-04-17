'use client'

import { useState, useEffect } from 'react'
import { Plus, Save, X, Trash2, GripVertical } from 'lucide-react'

type Faq = { id: string; question: string; answer: string }
const emptyFaq = { question: '', answer: '' }

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<Faq[]>([])
  const [editing, setEditing] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ ...emptyFaq })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/admin/faqs').then((r) => r.json()).then(setFaqs)
  }, [])

  async function handleSave(id?: string) {
    setSaving(true)
    const url = id ? `/api/admin/faqs/${id}` : '/api/admin/faqs'
    const method = id ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) {
      const data = await res.json()
      if (id) setFaqs((prev) => prev.map((f) => (f.id === id ? data : f)))
      else setFaqs((prev) => [...prev, data])
      setEditing(null)
      setAdding(false)
      setForm({ ...emptyFaq })
    }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/admin/faqs/${id}`, { method: 'DELETE' })
    if (res.ok) setFaqs((prev) => prev.filter((f) => f.id !== id))
  }

  const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent'

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">FAQs</h1>
          <p className="text-gray-500 text-sm mt-1">{faqs.length} questions</p>
        </div>
        {!adding && (
          <button onClick={() => { setAdding(true); setEditing(null); setForm({ ...emptyFaq }) }} className="flex items-center gap-2 bg-brand-red hover:bg-brand-red-dark text-white font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors">
            <Plus size={16} /> Add FAQ
          </button>
        )}
      </div>

      {adding && (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-5">
          <h2 className="font-semibold text-gray-900 mb-4">New Question</h2>
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Question</label>
              <input value={form.question} onChange={(e) => setForm((p) => ({ ...p, question: e.target.value }))} className={inputClass} placeholder="e.g. What's included?" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Answer</label>
              <textarea rows={4} value={form.answer} onChange={(e) => setForm((p) => ({ ...p, answer: e.target.value }))} className={inputClass} placeholder="The answer..." />
            </div>
          </div>
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

      <div className="flex flex-col gap-3">
        {faqs.map((faq, i) => (
          <div key={faq.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-start gap-3">
              <div className="text-gray-300 mt-0.5 flex-shrink-0 cursor-grab">
                <GripVertical size={16} />
              </div>
              <div className="flex-1">
                {editing === faq.id ? (
                  <>
                    <div className="flex flex-col gap-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Question</label>
                        <input value={form.question} onChange={(e) => setForm((p) => ({ ...p, question: e.target.value }))} className={inputClass} />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Answer</label>
                        <textarea rows={4} value={form.answer} onChange={(e) => setForm((p) => ({ ...p, answer: e.target.value }))} className={inputClass} />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button onClick={() => handleSave(faq.id)} disabled={saving} className="flex items-center gap-2 bg-brand-red text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-brand-red-dark transition-colors disabled:opacity-50">
                        <Save size={14} /> {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button onClick={() => setEditing(null)} className="flex items-center gap-2 text-gray-500 text-sm px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors">
                        <X size={14} /> Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-xs font-bold text-gray-400 mb-1">Q{i + 1}</div>
                        <p className="font-semibold text-gray-900 mb-2">{faq.question}</p>
                        <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button onClick={() => { setEditing(faq.id); setForm({ question: faq.question, answer: faq.answer }) }} className="text-xs text-brand-red hover:text-brand-red-dark font-semibold transition-colors">Edit</button>
                        <button onClick={() => handleDelete(faq.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
