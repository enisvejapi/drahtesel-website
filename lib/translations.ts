import type { Locale } from './locale'
import deMessages from '../messages/de.json'
import enMessages from '../messages/en.json'

type NestedRecord = { [key: string]: string | NestedRecord }

const MESSAGES: Record<Locale, NestedRecord> = {
  de: deMessages as unknown as NestedRecord,
  en: enMessages as unknown as NestedRecord,
}

export function getTranslations(locale: Locale): NestedRecord {
  return MESSAGES[locale] ?? MESSAGES.de
}

export function t(messages: NestedRecord, key: string, fallback?: string): string {
  const parts = key.split('.')
  let current: string | NestedRecord = messages
  for (const part of parts) {
    if (typeof current !== 'object' || current === null) return fallback ?? key
    current = (current as NestedRecord)[part]
    if (current === undefined) return fallback ?? key
  }
  return typeof current === 'string' ? current : fallback ?? key
}
