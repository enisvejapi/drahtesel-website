'use client'

import type { OpeningHours } from '@/lib/data-server'
import { useLocale } from '@/components/LocaleProvider'

export const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const

export const DAYS_DISPLAY = [
  { key: 'mon' as const, labelDe: 'Mo' },
  { key: 'tue' as const, labelDe: 'Di' },
  { key: 'wed' as const, labelDe: 'Mi' },
  { key: 'thu' as const, labelDe: 'Do' },
  { key: 'fri' as const, labelDe: 'Fr' },
  { key: 'sat' as const, labelDe: 'Sa' },
  { key: 'sun' as const, labelDe: 'So' },
]

export function getOpenStatus(hours: OpeningHours): { isOpen: boolean; label: string } {
  if (hours.forceStatus === 'open')   return { isOpen: true,  label: 'Jetzt geöffnet' }
  if (hours.forceStatus === 'closed') return { isOpen: false, label: 'Vorübergehend geschlossen' }

  const now     = new Date()
  const dayKey  = DAY_KEYS[now.getDay()]
  const day     = hours[dayKey]

  if (day.closed) return { isOpen: false, label: 'Heute geschlossen' }

  const [oh, om] = day.open.split(':').map(Number)
  const [ch, cm] = day.close.split(':').map(Number)
  const nowMins   = now.getHours() * 60 + now.getMinutes()
  const openMins  = oh * 60 + om
  const closeMins = ch * 60 + cm

  if (nowMins >= openMins && nowMins < closeMins) {
    return { isOpen: true, label: `Geöffnet · ${day.open}–${day.close} Uhr` }
  }
  return { isOpen: false, label: `Geschlossen · Öffnet um ${day.open} Uhr` }
}

export default function OpeningHoursWidget({ hours }: { hours: OpeningHours }) {
  const { t }      = useLocale()
  const todayKey   = DAY_KEYS[new Date().getDay()]
  const { isOpen } = getOpenStatus(hours)

  // Check if all days share the same open/close/closed values → show "Täglich"
  const allSame = DAYS_DISPLAY.every(({ key }) =>
    hours[key].closed  === hours.mon.closed &&
    hours[key].open    === hours.mon.open   &&
    hours[key].close   === hours.mon.close
  )

  return (
    <div className="flex-shrink-0 w-full max-w-[260px] lg:max-w-none lg:w-64 xl:w-72 bg-black/50 backdrop-blur-md border border-white/15 rounded-2xl p-2 lg:p-5 shadow-2xl text-[11px] lg:text-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 lg:mb-4">
        <span className="text-white text-xs lg:text-sm font-bold">{t('openingHours.title')}</span>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
          isOpen
            ? 'bg-green-500/15 border-green-400/30 text-green-300'
            : 'bg-red-500/15 border-red-400/30 text-red-300'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isOpen ? 'bg-green-400 shadow-[0_0_5px_rgba(74,222,128,0.9)]' : 'bg-red-400'}`} />
          {isOpen ? t('openingHours.open') : t('openingHours.closed')}
        </div>
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-1 lg:gap-1.5">
        {allSame ? (
          /* Single "Täglich" row */
          <div className="flex items-center justify-between px-2.5 lg:px-3 py-1.5 lg:py-2 rounded-lg bg-white/10 border border-white/15 text-xs">
            <span className="font-semibold text-white">{t('openingHours.daily')}</span>
            {hours.mon.closed ? (
              <span className="text-red-400">{t('openingHours.closed')}</span>
            ) : (
              <span className="text-white font-semibold tabular-nums">
                {hours.mon.open} – {hours.mon.close} Uhr
              </span>
            )}
          </div>
        ) : (
          /* Per-day rows */
          DAYS_DISPLAY.map(({ key, labelDe }) => {
            const day     = hours[key]
            const isToday = key === todayKey
            return (
              <div
                key={key}
                className={`flex items-center justify-between px-2.5 lg:px-3 py-1 lg:py-1.5 rounded-lg text-xs ${
                  isToday ? 'bg-white/10 border border-white/15' : ''
                }`}
              >
                <span className={`font-semibold w-6 flex-shrink-0 ${isToday ? 'text-white' : 'text-white/50'}`}>
                  {labelDe}
                </span>
                {isToday && (
                  <span className="text-brand-red text-[9px] font-bold uppercase tracking-wide mr-auto ml-2">
                    {t('openingHours.today')}
                  </span>
                )}
                {day.closed ? (
                  <span className={isToday ? 'text-red-400' : 'text-white/30'}>{t('openingHours.closed')}</span>
                ) : day.breakStart && day.breakEnd ? (
                  <span className={`tabular-nums text-right leading-tight ${isToday ? 'text-white font-semibold' : 'text-white/50'}`}>
                    {day.open}–{day.breakStart}<br />{day.breakEnd}–{day.close}
                  </span>
                ) : (
                  <span className={`tabular-nums ${isToday ? 'text-white font-semibold' : 'text-white/50'}`}>
                    {day.open} – {day.close}
                  </span>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Force status note */}
      {hours.forceStatus && (
        <div className={`mt-3 px-3 py-2 rounded-lg text-[10px] font-medium text-center ${
          hours.forceStatus === 'open'
            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
            : 'bg-red-500/10 text-red-400 border border-red-500/20'
        }`}>
          {hours.forceStatus === 'open'
            ? '● Heute besondere Öffnungszeiten'
            : '● Heute vorübergehend geschlossen'}
        </div>
      )}
    </div>
  )
}
