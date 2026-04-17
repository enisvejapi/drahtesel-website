'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react'

const DAYS_DE = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
const DAYS_EN = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
const MONTHS_DE = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember']
const MONTHS_EN = ['January','February','March','April','May','June','July','August','September','October','November','December']

export function sod(d: Date) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()) }
export function addDays(d: Date, n: number) { const r = new Date(d); r.setDate(r.getDate() + n); return r }
export function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}
// Inclusive day count: 30.03 → 31.03 = 2 days
export function inclusiveDays(start: Date, end: Date) {
  return Math.round((end.getTime() - start.getTime()) / 86400000) + 1
}

function getMonthCells(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1).getDay()
  const offset = firstDay === 0 ? 6 : firstDay - 1
  const total = new Date(year, month + 1, 0).getDate()
  const cells: (Date | null)[] = []
  for (let i = 0; i < offset; i++) cells.push(null)
  for (let d = 1; d <= total; d++) cells.push(new Date(year, month, d))
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

interface Props {
  startDate: Date | null
  endDate: Date | null
  onChange: (start: Date | null, end: Date | null) => void
  de: boolean
  minDaysFromToday?: number
  minRangeDays?: number   // inclusive (2 = at least 2 days: pickup + return)
}

function MonthGrid({
  year, month, startDate, endDate, hoverDate, minStart, minRangeDays, de,
  onDayClick, onDayHover, onDayLeave,
}: {
  year: number; month: number
  startDate: Date | null; endDate: Date | null; hoverDate: Date | null
  minStart: Date; minRangeDays: number; de: boolean
  onDayClick: (d: Date) => void
  onDayHover: (d: Date) => void
  onDayLeave: () => void
}) {
  const today = sod(new Date())
  const DAYS = de ? DAYS_DE : DAYS_EN
  const MONTHS = de ? MONTHS_DE : MONTHS_EN
  const cells = getMonthCells(year, month)

  // Preview end = confirmed end OR hover if valid
  const previewEnd = endDate ?? (
    startDate && hoverDate && hoverDate > startDate &&
    inclusiveDays(startDate, hoverDate) >= minRangeDays
      ? hoverDate : null
  )

  function isDisabled(d: Date) { return d < minStart }
  function isStart(d: Date) { return !!startDate && sameDay(d, startDate) }
  function isEnd(d: Date) {
    return !!previewEnd && !!startDate && sameDay(d, previewEnd) && previewEnd > startDate
  }
  function isInRange(d: Date) {
    if (!startDate || !previewEnd) return false
    return d > startDate && d < previewEnd
  }
  // Too close = valid date but would make range < minRangeDays (inclusive)
  function isTooClose(d: Date) {
    if (!startDate || endDate || sameDay(d, startDate)) return false
    return d > startDate && inclusiveDays(startDate, d) < minRangeDays
  }

  return (
    <div>
      <div className="text-center font-bold text-brand-black text-sm mb-3">
        {MONTHS[month]} {year}
      </div>
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[10px] font-bold text-brand-gray uppercase py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((d, i) => {
          if (!d) return <div key={i} className="h-9" />

          const disabled = isDisabled(d)
          const tooClose = isTooClose(d)
          const start = isStart(d)
          const end = isEnd(d)
          const inRange = isInRange(d)
          const isToday = sameDay(d, today)
          const hasRange = !!previewEnd && !!startDate && previewEnd > startDate

          return (
            <div key={i} className="relative h-9 flex items-center justify-center">
              {/* Range background strip */}
              {hasRange && (start || end || inRange) && (
                <div className={`absolute inset-y-1 bg-brand-red/15 pointer-events-none ${
                  start && end ? 'hidden' :
                  start ? 'left-1/2 right-0' :
                  end ? 'left-0 right-1/2' :
                  'left-0 right-0'
                }`} />
              )}
              <button
                onClick={() => !disabled && !tooClose && onDayClick(d)}
                onMouseEnter={() => !disabled && !tooClose && onDayHover(d)}
                onMouseLeave={onDayLeave}
                disabled={disabled}
                className={`relative z-10 w-8 h-8 rounded-full text-xs flex items-center justify-center font-medium transition-all ${
                  disabled || tooClose
                    ? 'text-gray-300 cursor-not-allowed'
                    : (start || (end && !!endDate))
                    ? 'bg-brand-red text-white font-bold shadow-sm'
                    : end
                    ? 'bg-brand-red/60 text-white font-bold'
                    : inRange
                    ? 'hover:bg-brand-red/30 text-brand-black cursor-pointer'
                    : isToday
                    ? 'ring-2 ring-brand-red text-brand-red hover:bg-brand-red/10 cursor-pointer font-bold'
                    : 'hover:bg-brand-red/15 text-brand-black cursor-pointer'
                }`}
              >
                {d.getDate()}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function DateRangePicker({
  startDate, endDate, onChange, de,
  minDaysFromToday = 3,
  minRangeDays = 2,
}: Props) {
  const today = sod(new Date())
  const minStart = addDays(today, minDaysFromToday)

  const [year, setYear] = useState(() => minStart.getFullYear())
  const [month, setMonth] = useState(() => minStart.getMonth())
  const [hoverDate, setHoverDate] = useState<Date | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const month2 = month === 11 ? 0 : month + 1
  const year2 = month === 11 ? year + 1 : year

  function goPrev() {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  function goNext() {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  function showError(msg: string) {
    setErrorMsg(msg)
    setTimeout(() => setErrorMsg(null), 2500)
  }

  function handleClick(d: Date) {
    if (!startDate || endDate) {
      // Start fresh — pick new start date
      onChange(d, null)
      return
    }

    // We have start, no end yet
    if (sameDay(d, startDate)) {
      // Same day clicked — minimum 2 days, show error
      showError(de ? 'Mindestmietdauer: 2 Tage' : 'Min. rental: 2 days')
      return
    }

    if (d < startDate) {
      // Clicked before start — reset to new start
      onChange(d, null)
      return
    }

    if (inclusiveDays(startDate, d) < minRangeDays) {
      showError(de ? `Mindestmietdauer: ${minRangeDays} Tage` : `Min. ${minRangeDays} days rental`)
      return
    }

    onChange(startDate, d)
  }

  function handleHover(d: Date) {
    if (!endDate && startDate) setHoverDate(d)
  }

  const commonProps = {
    startDate, endDate, hoverDate, minStart, minRangeDays, de,
    onDayClick: handleClick,
    onDayHover: handleHover,
    onDayLeave: () => setHoverDate(null),
  }

  return (
    <div>
      {/* Navigation arrows */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goPrev}
          className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={goNext}
          className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Single month mobile / two months desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MonthGrid year={year} month={month} {...commonProps} />
        <div className="hidden md:block">
          <MonthGrid year={year2} month={month2} {...commonProps} />
        </div>
      </div>

      {/* Error popup */}
      {errorMsg && (
        <div className="mt-3 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl px-4 py-2.5 animate-pulse">
          <AlertCircle size={14} className="flex-shrink-0" />
          {errorMsg}
        </div>
      )}
    </div>
  )
}
