'use client'

import { useEffect, useRef } from 'react'

interface Dot {
  originX: number
  originY: number
  x: number
  y: number
  vx: number
  vy: number
  intensity: number
}

interface TrailPoint {
  x: number
  y: number
  t: number
}

interface Props {
  gridSize?: number
  repulsionStrength?: number
  radius?: number
  dotSize?: number
  gridThickness?: number
  baseOpacity?: number
  dotColor?: string
  lineColor?: string
  accentColor?: string
  className?: string
}

export default function InteractiveGrid({
  gridSize = 60,
  repulsionStrength = 0.65,
  radius = 260,
  dotSize = 1.5,
  gridThickness = 0.5,
  baseOpacity = 0.09,
  dotColor = '#ffffff',
  lineColor = '#ffffff',
  accentColor = '#C8102E',
  className = '',
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dotsRef = useRef<Dot[]>([])
  const mousePosRef = useRef({ x: -9999, y: -9999 })
  const trailRef = useRef<TrailPoint[]>([])
  const rafRef = useRef<number>(0)
  const isDownRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // ── resize & rebuild grid ──────────────────────────────────────────────────
    function buildGrid() {
      if (!canvas) return
      const dpr = window.devicePixelRatio || 1
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx!.scale(dpr, dpr)

      dotsRef.current = []
      const cols = Math.ceil(canvas.offsetWidth / gridSize) + 1
      const rows = Math.ceil(canvas.offsetHeight / gridSize) + 1
      const offsetX = ((canvas.offsetWidth % gridSize) / 2)
      const offsetY = ((canvas.offsetHeight % gridSize) / 2)

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const ox = offsetX + c * gridSize
          const oy = offsetY + r * gridSize
          dotsRef.current.push({ originX: ox, originY: oy, x: ox, y: oy, vx: 0, vy: 0, intensity: 0 })
        }
      }
    }

    buildGrid()

    const ro = new ResizeObserver(() => {
      buildGrid()
    })
    ro.observe(canvas)

    // ── hex → rgb ──────────────────────────────────────────────────────────────
    function hexRgb(hex: string) {
      const h = hex.replace('#', '')
      return {
        r: parseInt(h.substring(0, 2), 16),
        g: parseInt(h.substring(2, 4), 16),
        b: parseInt(h.substring(4, 6), 16),
      }
    }

    function lerpColor(
      a: { r: number; g: number; b: number },
      b: { r: number; g: number; b: number },
      t: number
    ) {
      return {
        r: Math.round(a.r + (b.r - a.r) * t),
        g: Math.round(a.g + (b.g - a.g) * t),
        b: Math.round(a.b + (b.b - a.b) * t),
      }
    }

    const lineRgb = hexRgb(lineColor)
    const accentRgb = hexRgb(accentColor)
    const dotRgb = hexRgb(dotColor)

    // ── animation loop ─────────────────────────────────────────────────────────
    const startTime = Date.now()
    const FADE_DURATION = 700 // ms

    function tick() {
      const fadeIn = Math.min(1, (Date.now() - startTime) / FADE_DURATION)
      if (!canvas || !ctx) return
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)

      const mx = mousePosRef.current.x
      const my = mousePosRef.current.y
      const now = Date.now()

      // prune old trail points
      const maxAge = Math.max(200, 8 * 40)
      trailRef.current = trailRef.current.filter(p => now - p.t < maxAge)

      const dots = dotsRef.current
      const cols = Math.ceil(w / gridSize) + 1

      // ── physics ──────────────────────────────────────────────────────────────
      for (const dot of dots) {
        const dx = dot.x - mx
        const dy = dot.y - my
        const dist = Math.sqrt(dx * dx + dy * dy)

        let intensity = 0
        if (dist < radius) {
          intensity = 1 - dist / radius
          const force = Math.pow(intensity, 2) * repulsionStrength
          const pushX = (dx / (dist || 1)) * force * gridSize
          const pushY = (dy / (dist || 1)) * force * gridSize
          const stiffness = 0.02 + intensity * 0.06
          const damping = 0.70 + intensity * 0.05

          const restorX = (dot.originX - dot.x) * stiffness
          const restorY = (dot.originY - dot.y) * stiffness

          dot.vx = (dot.vx + restorX + pushX) * damping
          dot.vy = (dot.vy + restorY + pushY) * damping
        } else {
          const stiffness = 0.04
          const damping = 0.75
          dot.vx = (dot.vx + (dot.originX - dot.x) * stiffness) * damping
          dot.vy = (dot.vy + (dot.originY - dot.y) * stiffness) * damping
        }

        dot.x += dot.vx
        dot.y += dot.vy
        dot.intensity += (intensity - dot.intensity) * 0.12
      }

      // ── draw lines ───────────────────────────────────────────────────────────
      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i]
        const col = i % cols
        const row = Math.floor(i / cols)

        const lineIntensity = Math.max(dot.intensity, 0)
        const c = lerpColor(lineRgb, accentRgb, lineIntensity)
        const alpha = (baseOpacity + lineIntensity * 0.5) * fadeIn

        ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${alpha})`
        ctx.lineWidth = gridThickness + lineIntensity * 0.8

        // right neighbour
        if (col < cols - 1) {
          const right = dots[i + 1]
          if (right) {
            ctx.beginPath()
            ctx.moveTo(dot.x, dot.y)
            ctx.lineTo(right.x, right.y)
            ctx.stroke()
          }
        }

        // bottom neighbour
        const bottom = dots[i + cols]
        if (bottom) {
          ctx.beginPath()
          ctx.moveTo(dot.x, dot.y)
          ctx.lineTo(bottom.x, bottom.y)
          ctx.stroke()
        }
      }

      // ── draw dots ─────────────────────────────────────────────────────────────
      for (const dot of dots) {
        const t = dot.intensity
        const c = lerpColor(dotRgb, accentRgb, t)
        const alpha = (baseOpacity * 2 + t * 0.7) * fadeIn
        const size = dotSize + t * dotSize * 1.8

        ctx.beginPath()
        ctx.arc(dot.x, dot.y, size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${alpha})`
        ctx.fill()
      }

      // ── draw trail ────────────────────────────────────────────────────────────
      if (trailRef.current.length > 1) {
        ctx.beginPath()
        ctx.moveTo(trailRef.current[0].x, trailRef.current[0].y)
        for (let i = 1; i < trailRef.current.length; i++) {
          const p = trailRef.current[i]
          const age = (now - p.t) / maxAge
          const alpha = (1 - age) * 0.15 * fadeIn
          ctx.strokeStyle = `rgba(${accentRgb.r},${accentRgb.g},${accentRgb.b},${alpha})`
          ctx.lineWidth = (1 - age) * 2
          ctx.lineTo(p.x, p.y)
          ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
        }
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    const startDelay = setTimeout(() => {
      rafRef.current = requestAnimationFrame(tick)
    }, 150)

    // ── mouse events ──────────────────────────────────────────────────────────
    function getPos(e: MouseEvent | Touch) {
      const rect = canvas!.getBoundingClientRect()
      return { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    function onMouseMove(e: MouseEvent) {
      const pos = getPos(e)
      mousePosRef.current = pos
      trailRef.current.push({ ...pos, t: Date.now() })
    }

    function onMouseDown() { isDownRef.current = true }
    function onMouseUp() { isDownRef.current = false }

    function onMouseLeave() {
      // fade mouse out slowly
      mousePosRef.current = { x: -9999, y: -9999 }
    }

    function onTouchMove(e: TouchEvent) {
      const pos = getPos(e.touches[0])
      mousePosRef.current = pos
      trailRef.current.push({ ...pos, t: Date.now() })
    }

    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mousedown', onMouseDown)
    canvas.addEventListener('mouseup', onMouseUp)
    canvas.addEventListener('mouseleave', onMouseLeave)
    canvas.addEventListener('touchmove', onTouchMove, { passive: true })

    return () => {
      clearTimeout(startDelay)
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mousedown', onMouseDown)
      canvas.removeEventListener('mouseup', onMouseUp)
      canvas.removeEventListener('mouseleave', onMouseLeave)
      canvas.removeEventListener('touchmove', onTouchMove)
    }
  }, [gridSize, repulsionStrength, radius, dotSize, gridThickness, baseOpacity, dotColor, lineColor, accentColor])

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{ display: 'block' }}
    />
  )
}
