'use client'

import { useState, useRef, type FormEvent } from 'react'
import { AlertTriangle, MapPin, CheckCircle2, Loader2, ChevronRight } from 'lucide-react'

type Step = 'form' | 'submitting' | 'success' | 'error'

export default function BikeReport() {
  const [bikeNumber, setBikeNumber] = useState('')
  const [note, setNote] = useState('')
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locStatus, setLocStatus] = useState<'idle' | 'loading' | 'ok' | 'denied'>('idle')
  const [step, setStep] = useState<Step>('form')
  const [bikeError, setBikeError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function handleBikeInput(val: string) {
    const digits = val.replace(/\D/g, '').slice(0, 4)
    setBikeNumber(digits)
    setBikeError('')
  }

  function getLocation() {
    if (!navigator.geolocation) {
      setLocStatus('denied')
      return
    }
    setLocStatus('loading')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLocStatus('ok')
      },
      () => setLocStatus('denied'),
      { timeout: 10000 }
    )
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const num = parseInt(bikeNumber, 10)
    if (!bikeNumber || isNaN(num) || num < 1 || num > 1200) {
      setBikeError('Bitte gib eine gültige Fahrradnummer (0001 – 1200) ein.')
      inputRef.current?.focus()
      return
    }

    setStep('submitting')
    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bikeNumber,
          lat: location?.lat ?? null,
          lng: location?.lng ?? null,
          note,
        }),
      })
      if (!res.ok) throw new Error()
      setStep('success')
    } catch {
      setStep('error')
    }
  }

  function reset() {
    setBikeNumber('')
    setNote('')
    setLocation(null)
    setLocStatus('idle')
    setStep('form')
    setBikeError('')
  }

  if (step === 'success') {
    return (
      <section className="py-20 bg-[#0f0f0f]">
        <div className="container-site max-w-lg mx-auto text-center px-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/15 mb-5">
            <CheckCircle2 size={32} className="text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Meldung eingegangen!</h2>
          <p className="text-gray-400 mb-8">
            Wir haben deine Meldung erhalten und kommen so schnell wie möglich zu dir.
            Bleib beim Fahrrad und halte dein Handy bereit.
          </p>
          <button onClick={reset} className="btn-primary">
            Neue Meldung senden
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-[#0f0f0f]">
      <div className="container-site px-4">
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex items-center gap-1.5 bg-brand-red/15 text-brand-red text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              <AlertTriangle size={12} />
              Pannenhilfe
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Problem mit dem Fahrrad?
          </h2>
          <p className="text-gray-400 mb-10 text-lg leading-relaxed">
            Gib einfach deine Fahrradnummer ein und sende uns deinen Standort —
            wir kommen direkt zu dir.
          </p>

          {/* Card */}
          <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col gap-6">

            {/* Bike Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Fahrradnummer
                <span className="text-gray-500 font-normal ml-2">0001 – 1200</span>
              </label>
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  inputMode="numeric"
                  placeholder="z.B. 0042"
                  value={bikeNumber}
                  onChange={(e) => handleBikeInput(e.target.value)}
                  className={`w-full bg-white border rounded-xl px-4 py-3.5 text-black placeholder-gray-400 text-2xl font-mono tracking-widest focus:outline-none focus:ring-2 transition-colors ${
                    bikeError
                      ? 'border-red-500 focus:ring-red-500/40'
                      : 'border-gray-300 focus:ring-brand-red/40 focus:border-brand-red/50'
                  }`}
                  maxLength={4}
                  autoComplete="off"
                />
                {bikeNumber.length === 4 && !bikeError && (
                  <CheckCircle2 size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-green-400" />
                )}
              </div>
              {bikeError && (
                <p className="mt-2 text-sm text-red-400">{bikeError}</p>
              )}
              <p className="mt-2 text-xs text-gray-600">
                Die Nummer findest du auf dem Aufkleber am Rahmen oder Lenker.
              </p>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Dein Standort
                <span className="text-gray-500 font-normal ml-2">empfohlen</span>
              </label>
              {locStatus === 'idle' && (
                <button
                  type="button"
                  onClick={getLocation}
                  className="flex items-center gap-2.5 w-full border border-white/15 hover:border-brand-red/50 bg-white/5 hover:bg-brand-red/8 text-gray-300 hover:text-white rounded-xl px-4 py-3.5 transition-all text-sm font-medium"
                >
                  <MapPin size={18} className="text-brand-red flex-shrink-0" />
                  Aktuellen Standort ermitteln
                  <ChevronRight size={16} className="ml-auto text-gray-600" />
                </button>
              )}
              {locStatus === 'loading' && (
                <div className="flex items-center gap-2.5 border border-white/15 bg-white/5 rounded-xl px-4 py-3.5 text-gray-400 text-sm">
                  <Loader2 size={18} className="animate-spin text-brand-red" />
                  Standort wird ermittelt…
                </div>
              )}
              {locStatus === 'ok' && location && (
                <div className="flex items-center gap-2.5 border border-green-500/30 bg-green-500/8 rounded-xl px-4 py-3.5 text-green-400 text-sm">
                  <CheckCircle2 size={18} className="flex-shrink-0" />
                  <span>
                    Standort erkannt —{' '}
                    <span className="font-mono text-xs text-green-300">
                      {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => { setLocation(null); setLocStatus('idle') }}
                    className="ml-auto text-green-600 hover:text-green-400 text-xs underline"
                  >
                    Zurücksetzen
                  </button>
                </div>
              )}
              {locStatus === 'denied' && (
                <div className="border border-yellow-500/30 bg-yellow-500/8 rounded-xl px-4 py-3.5 text-yellow-400 text-sm">
                  Standortzugriff verweigert. Beschreibe deinen Standort unten im Feld.
                </div>
              )}
            </div>

            {/* Note */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Was ist das Problem?
                <span className="text-gray-500 font-normal ml-2">optional</span>
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Beschreibe das Problem kurz…"
                rows={2}
                maxLength={40}
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-black placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/40 focus:border-brand-red/50 transition-colors resize-none"
              />
              <p className="text-xs text-gray-500 text-right mt-1">{note.length}/40</p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={step === 'submitting'}
              className="btn-primary flex items-center justify-center gap-2 py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {step === 'submitting' ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Wird gesendet…
                </>
              ) : (
                <>
                  <AlertTriangle size={18} />
                  Pannenhilfe anfordern
                </>
              )}
            </button>

            {step === 'error' && (
              <p className="text-center text-red-400 text-sm -mt-2">
                Etwas ist schiefgelaufen. Ruf uns direkt an:{' '}
                <a href="tel:+4949324980397" className="underline">+49 4932 4980397</a>
              </p>
            )}

          </form>

          {/* Reassurance */}
          <p className="text-center text-gray-600 text-sm mt-5">
            Wir reagieren so schnell wie möglich · Du kannst uns auch direkt anrufen:{' '}
            <a href="tel:+4949324980397" className="text-gray-400 hover:text-white transition-colors">
              +49 4932 4980397
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
