export interface WeeklyPin {
  week: number
  startDate: string   // YYYY-MM-DD
  endDate: string     // YYYY-MM-DD
  pin: string
}

const LS_KEY = 'drahtesel_pin_session'

// ── Get current active PIN entry ─────────────────────────────────────────────
export function getCurrentWeekEntry(pins: WeeklyPin[]): WeeklyPin | null {
  const today = new Date().toISOString().split('T')[0]
  return pins.find(p => today >= p.startDate && today <= p.endDate) ?? null
}

// ── Validate a PIN input against today's active PIN ───────────────────────────
export function validatePin(input: string, pins: WeeklyPin[]): boolean {
  const entry = getCurrentWeekEntry(pins)
  if (!entry) return false
  return input.trim() === entry.pin
}

// ── localStorage session ──────────────────────────────────────────────────────
interface PinSession {
  unlockedWeekStart: string  // the startDate of the week this was unlocked for
}

export function hasPinSession(pins: WeeklyPin[]): boolean {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return false
    const session: PinSession = JSON.parse(raw)
    const entry = getCurrentWeekEntry(pins)
    if (!entry) return false
    // Valid only if unlocked for the current week
    return session.unlockedWeekStart === entry.startDate
  } catch {
    return false
  }
}

export function savePinSession(pins: WeeklyPin[]): void {
  const entry = getCurrentWeekEntry(pins)
  if (!entry) return
  const session: PinSession = { unlockedWeekStart: entry.startDate }
  localStorage.setItem(LS_KEY, JSON.stringify(session))
}

export function clearPinSession(): void {
  localStorage.removeItem(LS_KEY)
}
