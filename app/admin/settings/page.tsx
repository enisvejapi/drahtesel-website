'use client'

import { useState } from 'react'
import { Save, Eye, EyeOff, CheckCircle, AlertCircle, Key } from 'lucide-react'

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [showNewPw, setShowNewPw] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaved(false)

    if (!newPassword) { setError('Bitte neues Passwort eingeben'); return }
    if (newPassword !== confirmPassword) { setError('Passwörter stimmen nicht überein'); return }
    if (newPassword.length < 8) { setError('Mindestens 8 Zeichen erforderlich'); return }

    setSaving(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      })
      if (res.ok) {
        setSaved(true)
        setNewPassword('')
        setConfirmPassword('')
        setTimeout(() => setSaved(false), 3000)
      } else {
        const data = await res.json()
        setError(data.error || 'Speichern fehlgeschlagen')
      }
    } catch {
      setError('Verbindungsfehler')
    } finally {
      setSaving(false)
    }
  }

  const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent'
  const labelClass = 'block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5'

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Einstellungen</h1>
        <p className="text-gray-500 text-sm mt-1">Admin-Passwort ändern</p>
      </div>

      <form onSubmit={handleSave} className="max-w-md space-y-5">
        {saved && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm font-medium">
            <CheckCircle size={15} /> Passwort erfolgreich gespeichert
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <AlertCircle size={15} /> {error}
          </div>
        )}

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-5">
            <Key size={16} className="text-brand-red" />
            <h2 className="font-semibold text-gray-900">Admin-Passwort</h2>
          </div>
          <p className="text-xs text-gray-500 mb-4">Mindestens 8 Zeichen.</p>
          <div className="flex flex-col gap-4">
            <div>
              <label className={labelClass}>Neues Passwort</label>
              <div className="relative">
                <input
                  type={showNewPw ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={inputClass + ' pr-9'}
                  placeholder="Neues Passwort"
                />
                <button type="button" onClick={() => setShowNewPw(!showNewPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showNewPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <div>
              <label className={labelClass}>Passwort bestätigen</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputClass} placeholder="Passwort wiederholen" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving}
          className="flex items-center gap-2 bg-brand-red hover:bg-brand-red-dark text-white font-semibold px-6 py-3 rounded-lg text-sm transition-colors disabled:opacity-50">
          {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={15} />}
          {saving ? 'Speichern…' : 'Passwort speichern'}
        </button>
      </form>
    </div>
  )
}
