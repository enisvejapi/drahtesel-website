'use client'

import { useEffect, useState } from 'react'
import type { InterestPin } from '@/lib/interest-pins'

interface Props {
  pin: InterestPin | null
  totalDistance: number
  locale: 'de' | 'en'
  onDone: () => void
}

function fmtDist(m: number) {
  if (m < 1000) return `${Math.round(m)} m`
  return `${(m / 1000).toFixed(1)} km`
}

// SVG circle: r=54, circumference = 2π×54 ≈ 339.3
const R = 54
const CIRC = 2 * Math.PI * R

export default function NavStartSplash({ pin, totalDistance, locale, onDone }: Props) {
  const de = locale === 'de'
  // 0 = mounting  1 = active  2 = exiting
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const t0 = setTimeout(() => setPhase(1), 30)
    const t1 = setTimeout(() => setPhase(2), 2100)
    const t2 = setTimeout(onDone, 2750)
    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2) }
  }, [onDone])

  const active  = phase === 1
  const exiting = phase === 2

  return (
    <div
      style={{
        position: 'absolute', inset: 0, zIndex: 2000,
        background: '#080808',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
        // Entry: fade in fast. Exit: scale up + fade (zoom-through into map)
        opacity: active ? 1 : 0,
        transform: exiting ? 'scale(1.14)' : 'scale(1)',
        transition: exiting
          ? 'opacity 0.55s cubic-bezier(0.4,0,1,1), transform 0.55s cubic-bezier(0.4,0,1,1)'
          : 'opacity 0.22s ease',
      }}
    >
      {/* ── Top charging bar ───────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: 'rgba(255,255,255,0.04)',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          background: 'linear-gradient(90deg, #C8102E 0%, #ff3d5a 60%, #ff8fa0 100%)',
          boxShadow: '0 0 12px rgba(200,16,46,0.9)',
          width: active ? '100%' : '0%',
          transition: active ? 'width 2.0s cubic-bezier(0.4,0,0.2,1)' : 'none',
        }} />
      </div>

      {/* ── Medallion ──────────────────────────────────────────────── */}
      <div style={{
        position: 'relative', width: 140, height: 140,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>

        {/* Outer slow-spin ring */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: '1px dashed rgba(255,255,255,0.06)',
          animation: active ? 'navSpin 8s linear infinite' : 'none',
        }} />

        {/* Drawing arc (SVG stroke-dashoffset) */}
        <svg
          width="140" height="140"
          style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}
        >
          {/* Track */}
          <circle cx="70" cy="70" r={R}
            fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />
          {/* Animated arc */}
          <circle cx="70" cy="70" r={R}
            fill="none" stroke="#C8102E" strokeWidth="2" strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={active ? 0 : CIRC}
            style={{
              transition: active ? 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1) 0.05s' : 'none',
              filter: 'drop-shadow(0 0 8px rgba(200,16,46,0.8))',
            }}
          />
          {/* Trailing glow dot at the leading edge */}
          {active && (
            <circle cx="70" cy="70" r={R}
              fill="none" stroke="rgba(255,100,120,0.6)" strokeWidth="6" strokeLinecap="round"
              strokeDasharray="1 999"
              strokeDashoffset={active ? 0 : CIRC}
              style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1) 0.05s' }}
            />
          )}
        </svg>

        {/* Fast-spin inner ring (hint of motion) */}
        <div style={{
          position: 'absolute', inset: 14, borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.03)',
          borderTopColor: 'rgba(200,16,46,0.25)',
          animation: active ? 'navSpin 2s linear infinite' : 'none',
        }} />

        {/* Center disc */}
        <div style={{
          width: 76, height: 76, borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, #1e1e1e, #0a0a0a)',
          border: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.8), 0 0 24px rgba(200,16,46,0.15), inset 0 1px 0 rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: active ? 'scale(1)' : 'scale(0.65)',
          transition: 'transform 0.55s cubic-bezier(0.34,1.56,0.64,1) 0.1s',
        }}>
          {/* Navigation arrow */}
          <svg viewBox="0 0 24 24" width="30" height="30"
            style={{
              transform: active ? 'translateY(0) scale(1)' : 'translateY(5px) scale(0.8)',
              transition: 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.25s',
              filter: 'drop-shadow(0 2px 10px rgba(200,16,46,0.6))',
            }}
          >
            <path d="M12 2.5L5 20l7-4.5 7 4.5L12 2.5z" fill="#C8102E" />
            <path d="M12 6L8 18l4-2.5 4 2.5L12 6z" fill="rgba(255,255,255,0.15)" />
          </svg>
        </div>
      </div>

      {/* ── Text block ─────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
        marginTop: 28,
        opacity: active ? 1 : 0,
        transform: active ? 'translateY(0)' : 'translateY(14px)',
        transition: 'opacity 0.55s ease 0.35s, transform 0.55s cubic-bezier(0.34,1.56,0.64,1) 0.35s',
      }}>

        {/* Eyebrow label */}
        <span style={{
          fontSize: 9, fontWeight: 700, letterSpacing: '0.22em',
          color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}>
          {de ? 'Navigation startet' : 'Starting navigation'}
        </span>

        {/* Destination name */}
        {pin && (
          <p style={{
            fontSize: 20, fontWeight: 900, color: '#ffffff', textAlign: 'center',
            fontFamily: 'system-ui, -apple-system, sans-serif', lineHeight: 1.25,
            padding: '0 32px', maxWidth: 290, margin: 0,
            letterSpacing: '-0.02em',
          }}>
            {de ? pin.title.de : pin.title.en}
          </p>
        )}

        {/* Distance pill */}
        {totalDistance > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 20, padding: '5px 14px',
          }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#C8102E', boxShadow: '0 0 6px rgba(200,16,46,0.8)' }} />
            <span style={{
              fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.45)',
              fontFamily: 'system-ui, sans-serif', letterSpacing: '0.03em',
            }}>
              {fmtDist(totalDistance)} {de ? 'Fahrradroute' : 'cycling route'}
            </span>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#C8102E', boxShadow: '0 0 6px rgba(200,16,46,0.8)' }} />
          </div>
        )}
      </div>

      {/* ── Bottom brand mark ──────────────────────────────────────── */}
      <div style={{
        position: 'absolute', bottom: 32,
        opacity: active ? 0.2 : 0,
        transition: 'opacity 0.5s ease 0.6s',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <div style={{ width: 20, height: 1, background: 'rgba(255,255,255,0.4)' }} />
        <span style={{
          fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', color: 'white',
          textTransform: 'uppercase', fontFamily: 'system-ui, sans-serif',
        }}>
          Drahtesel Norderney
        </span>
        <div style={{ width: 20, height: 1, background: 'rgba(255,255,255,0.4)' }} />
      </div>
    </div>
  )
}
