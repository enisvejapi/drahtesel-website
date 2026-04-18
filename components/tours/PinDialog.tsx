'use client'

import { useEffect, useRef, useState } from 'react'
import { Lock, Phone, ShieldCheck } from 'lucide-react'

interface Props {
  locale: 'de' | 'en'
  onSuccess: () => void
  onValidate: (pin: string) => boolean
}

export default function PinDialog({ locale, onSuccess, onValidate }: Props) {
  const de = locale === 'de'
  const [digits, setDigits] = useState(['', '', ''])
  const [shake, setShake] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [locked, setLocked] = useState(false)
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]

  // Auto-focus first box on mount
  useEffect(() => {
    setTimeout(() => inputRefs[0].current?.focus(), 80)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function triggerShake() {
    setShake(true)
    setDigits(['', '', ''])
    setTimeout(() => {
      setShake(false)
      inputRefs[0].current?.focus()
    }, 500)
  }

  function handleDigit(index: number, value: string) {
    if (locked) return
    const digit = value.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[index] = digit
    setDigits(next)

    if (digit) {
      if (index < 2) {
        // Move to next box
        inputRefs[index + 1].current?.focus()
      } else {
        // Last digit filled — auto-submit
        const pin = next.join('')
        if (onValidate(pin)) {
          onSuccess()
        } else {
          const newAttempts = attempts + 1
          setAttempts(newAttempts)
          if (newAttempts >= 3) {
            setLocked(true)
          } else {
            triggerShake()
          }
        }
      }
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      // Move back on backspace if current is empty
      const next = [...digits]
      next[index - 1] = ''
      setDigits(next)
      inputRefs[index - 1].current?.focus()
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xs overflow-hidden">

        {/* Header */}
        <div className="bg-brand-black px-6 py-5 text-center">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-3">
            <Lock size={22} className="text-white" />
          </div>
          <h2 className="text-white font-extrabold text-lg leading-tight">
            {de ? 'Exklusiv für unsere Kunden' : 'Exclusive for our customers'}
          </h2>
          <p className="text-white/60 text-xs mt-1 leading-relaxed">
            {de
              ? 'Für Ihre Sicherheit und einen reibungslosen Start: Bitte fragen Sie unser Team nach dem aktuellen Zugangscode'
              : 'For your safety and a smooth start: Please ask our team for the current access code'}
          </p>
        </div>

        <div className="px-6 py-7">
          {!locked ? (
            <>
              {/* 3-digit input boxes */}
              <div
                className="flex gap-4 justify-center mb-6"
                style={{ animation: shake ? 'pinShake 0.4s ease' : 'none' }}
              >
                {digits.map((d, i) => (
                  <input
                    key={i}
                    ref={inputRefs[i]}
                    type="tel"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={e => handleDigit(i, e.target.value)}
                    onKeyDown={e => handleKeyDown(i, e)}
                    className="w-16 h-16 text-center text-3xl font-extrabold text-brand-black border-2 rounded-2xl outline-none transition-all"
                    style={{
                      borderColor: d ? '#C8102E' : '#E5E7EB',
                      background: d ? '#FFF5F5' : '#F9FAFB',
                      caretColor: 'transparent',
                    }}
                  />
                ))}
              </div>

              <p className="text-center text-[11px] text-gray-400 mb-2">
                {de
                  ? 'Der Zugangscode wechselt wöchentlich.'
                  : 'The access code changes weekly.'}
              </p>

              {attempts > 0 && (
                <p className="text-center text-xs text-red-500 font-semibold mb-4">
                  {de
                    ? `Falscher PIN. Noch ${3 - attempts} Versuch${3 - attempts === 1 ? '' : 'e'}.`
                    : `Wrong PIN. ${3 - attempts} attempt${3 - attempts === 1 ? '' : 's'} left.`}
                </p>
              )}

            </>
          ) : (
            /* Locked state */
            <div className="text-center py-2">
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
                <Phone size={24} className="text-brand-red" />
              </div>
              <h3 className="font-extrabold text-brand-black text-base mb-2">
                {de ? 'Zu viele Versuche' : 'Too many attempts'}
              </h3>
              <p className="text-sm text-gray-500 mb-5 leading-relaxed">
                {de
                  ? 'Bitte ruf uns an, damit wir dir weiterhelfen können.'
                  : 'Please call us so we can help you.'}
              </p>
              <a
                href="tel:+4949324980397"
                className="flex items-center justify-center gap-2 bg-brand-red text-white font-extrabold text-sm py-4 rounded-2xl hover:bg-red-700 transition-colors active:scale-[0.98]"
              >
                <Phone size={16} />
                +49 4932 4980397
              </a>
            </div>
          )}
        </div>

        {/* Footer hint */}
        {!locked && (
          <div className="border-t border-gray-100 px-6 py-3 flex items-center gap-2">
            <ShieldCheck size={13} className="text-gray-300 flex-shrink-0" />
            <p className="text-[10px] text-gray-300">
              {de ? 'Drahtesel Fahrradverleih · Norderney' : 'Drahtesel Bike Rental · Norderney'}
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pinShake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-8px); }
          40%       { transform: translateX(8px); }
          60%       { transform: translateX(-6px); }
          80%       { transform: translateX(6px); }
        }
      `}</style>
    </div>
  )
}
