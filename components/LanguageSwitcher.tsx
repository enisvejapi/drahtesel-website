'use client'

import { useLocale } from './LocaleProvider'

export default function LanguageSwitcher({ className, light }: { className?: string; light?: boolean }) {
  const { locale, setLocale } = useLocale()

  const inactive = light ? 'text-white/70 hover:text-white' : 'text-gray-500 hover:text-brand-black'
  const divider = light ? 'text-white/30' : 'text-gray-300'

  return (
    <div className={`flex items-center gap-1 text-sm font-medium ${className ?? ''}`}>
      <button
        onClick={() => setLocale('de')}
        className={`px-2 py-1 rounded transition-colors ${locale === 'de' ? 'text-brand-red font-bold' : inactive}`}
        aria-label="Deutsch"
      >
        DE
      </button>
      <span className={`${divider} select-none`}>|</span>
      <button
        onClick={() => setLocale('en')}
        className={`px-2 py-1 rounded transition-colors ${locale === 'en' ? 'text-brand-red font-bold' : inactive}`}
        aria-label="English"
      >
        EN
      </button>
    </div>
  )
}
