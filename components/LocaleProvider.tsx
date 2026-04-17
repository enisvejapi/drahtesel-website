'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

type Locale = 'de' | 'en'
type Messages = Record<string, unknown>

interface LocaleContextValue {
  locale: Locale
  messages: Messages
  t: (key: string, fallback?: string) => string
  setLocale: (locale: Locale) => Promise<void>
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

function resolve(obj: Messages, key: string, fallback: string): string {
  const parts = key.split('.')
  let current: unknown = obj
  for (const part of parts) {
    if (typeof current !== 'object' || current === null) return fallback
    current = (current as Record<string, unknown>)[part]
    if (current === undefined) return fallback
  }
  return typeof current === 'string' ? current : fallback
}

interface Props {
  locale: Locale
  messages: Messages
  children: ReactNode
}

export function LocaleProvider({ locale: initialLocale, messages: initialMessages, children }: Props) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)
  const [messages, setMessages] = useState<Messages>(initialMessages)

  const t = useCallback((key: string, fallback?: string) => {
    return resolve(messages, key, fallback ?? key)
  }, [messages])

  const setLocale = useCallback(async (newLocale: Locale) => {
    await fetch('/api/locale', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ locale: newLocale }) })
    const mod = newLocale === 'en'
      ? await import('../messages/en.json')
      : await import('../messages/de.json')
    setMessages(mod.default ?? (mod as unknown as Messages))
    setLocaleState(newLocale)
  }, [])

  return (
    <LocaleContext.Provider value={{ locale, messages, t, setLocale }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used inside LocaleProvider')
  return ctx
}
