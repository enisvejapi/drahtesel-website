'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useLocale } from '@/components/LocaleProvider'
import { ArrowRight, ChevronLeft, ChevronRight, Navigation, Bike, Map, Wrench } from 'lucide-react'

// ── Phone mockup: GPS Navigation ────────────────────────────────────────────
function NavMockup() {
  const [step, setStep] = useState(0)
  const steps = ['Links abbiegen', 'Geradeaus fahren', 'Ziel erreicht! 🏁']
  const arrows = ['left', 'straight', 'arrive']
  useEffect(() => {
    const t = setInterval(() => setStep(s => (s + 1) % steps.length), 2200)
    return () => clearInterval(t)
  }, [])
  const arrowAngle = arrows[step] === 'left' ? -90 : 0
  const isArrived = arrows[step] === 'arrive'
  return (
    <div style={{ height: '100%', background: 'linear-gradient(160deg,#1a2e1e,#243b27 50%,#1e3420)', position: 'relative', overflow: 'hidden' }}>
      {[20,40,60,80].map(y => <div key={y} style={{ position:'absolute',top:`${y}%`,left:0,right:0,height:1,background:'rgba(255,255,255,0.04)' }} />)}
      {[25,50,75].map(x => <div key={x} style={{ position:'absolute',left:`${x}%`,top:0,bottom:0,width:1,background:'rgba(255,255,255,0.04)' }} />)}
      <svg style={{ position:'absolute',inset:0,width:'100%',height:'65%' }} viewBox="0 0 220 240" preserveAspectRatio="none">
        <path d="M30 220 Q60 160 80 120 Q110 70 150 50 Q180 35 200 20" fill="none" stroke="rgba(200,16,46,0.35)" strokeWidth="8" strokeLinecap="round" />
        <path d="M30 220 Q60 160 80 120 Q110 70 150 50 Q180 35 200 20" fill="none" stroke="#C8102E" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="6 4" />
      </svg>
      <div style={{ position:'absolute',bottom:'35%',left:'10%',transform:'translateY(50%)' }}>
        <div style={{ width:20,height:26,position:'relative' }}>
          <svg viewBox="0 0 24 30" width="20" height="26" fill="#16a34a"><path d="M12 1C6.48 1 2 5.48 2 11c0 6.75 10 18 10 18S22 17.75 22 11c0-5.52-4.48-10-10-10z"/><circle cx="12" cy="11" r="5" fill="white"/></svg>
          <span style={{ position:'absolute',top:2,left:'50%',transform:'translateX(-50%)',fontSize:8,fontWeight:900,color:'#16a34a',fontFamily:'system-ui' }}>A</span>
        </div>
      </div>
      <div style={{ position:'absolute',top:'5%',right:'10%' }}>
        <div style={{ width:20,height:26,position:'relative' }}>
          <svg viewBox="0 0 24 30" width="20" height="26" fill="#C8102E"><path d="M12 1C6.48 1 2 5.48 2 11c0 6.75 10 18 10 18S22 17.75 22 11c0-5.52-4.48-10-10-10z"/><circle cx="12" cy="11" r="5" fill="white"/></svg>
          <span style={{ position:'absolute',top:2,left:'50%',transform:'translateX(-50%)',fontSize:8,fontWeight:900,color:'#C8102E',fontFamily:'system-ui' }}>B</span>
        </div>
      </div>
      <div style={{ position:'absolute',bottom:'37%',left:'13%',width:14,height:14,borderRadius:'50%',background:'#4285f4',border:'2.5px solid white',boxShadow:'0 0 0 4px rgba(66,133,244,0.25)' }} />
      <div style={{ position:'absolute',bottom:0,left:0,right:0,background:'#111',borderRadius:'16px 16px 0 0',padding:'12px 14px 14px' }}>
        <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:8 }}>
          <div style={{ width:36,height:36,borderRadius:10,flexShrink:0,background:isArrived?'#16a34a':'#C8102E',display:'flex',alignItems:'center',justifyContent:'center',transition:'background 0.4s' }}>
            {isArrived
              ? <span style={{ fontSize:16 }}>🏁</span>
              : <svg viewBox="0 0 24 24" width="18" height="18" fill="white" style={{ transform:`rotate(${arrowAngle}deg)`,transition:'transform 0.4s' }}><path d="M12 2.5L5 20l7-4.5 7 4.5L12 2.5z"/></svg>}
          </div>
          <div style={{ flex:1,minWidth:0 }}>
            <div style={{ fontSize:11,color:'rgba(255,255,255,0.4)',fontFamily:'system-ui',marginBottom:1 }}>In 80 m</div>
            <div style={{ fontSize:13,fontWeight:800,color:'white',fontFamily:'system-ui',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }}>{steps[step]}</div>
          </div>
          <div style={{ fontSize:10,fontWeight:700,color:'#C8102E',fontFamily:'system-ui',flexShrink:0 }}>1.2 km</div>
        </div>
        <div style={{ height:3,background:'rgba(255,255,255,0.08)',borderRadius:2,overflow:'hidden' }}>
          <div style={{ height:'100%',width:`${(step+1)/steps.length*100}%`,background:'#C8102E',borderRadius:2,transition:'width 0.6s ease' }} />
        </div>
      </div>
    </div>
  )
}

// ── Phone mockup: Bike Rental ────────────────────────────────────────────────
function BikeMockup() {
  const bikes = [
    { emoji:'🚲', name:'City Bike',      price:'12 €', tag:'Beliebt' },
    { emoji:'⚡', name:'E-Bike Premium', price:'22 €', tag:'Neu'     },
    { emoji:'👨‍👩‍👧', name:'Lastenrad',     price:'28 €', tag:'Familie' },
  ]
  const [active, setActive] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setActive(a => (a+1) % bikes.length), 2500)
    return () => clearInterval(t)
  }, [])
  return (
    <div style={{ height:'100%',background:'#f5f5f5',display:'flex',flexDirection:'column',padding:'14px 12px',gap:8,overflow:'hidden' }}>
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:4 }}>
        <span style={{ fontSize:12,fontWeight:900,color:'#111',fontFamily:'system-ui' }}>Fahrräder</span>
        <div style={{ background:'#C8102E',borderRadius:20,padding:'2px 8px' }}><span style={{ fontSize:9,fontWeight:700,color:'white',fontFamily:'system-ui' }}>NORDERNEY</span></div>
      </div>
      {bikes.map((bike,i) => (
        <div key={bike.name} style={{ background:'white',borderRadius:14,padding:'10px 12px',display:'flex',alignItems:'center',gap:10,border:i===active?'1.5px solid #C8102E':'1.5px solid transparent',boxShadow:i===active?'0 4px 16px rgba(200,16,46,0.12)':'0 2px 8px rgba(0,0,0,0.06)',transition:'all 0.4s ease',transform:i===active?'scale(1.02)':'scale(1)' }}>
          <div style={{ fontSize:26,width:42,height:42,background:'#f8f8f8',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>{bike.emoji}</div>
          <div style={{ flex:1 }}>
            <div style={{ display:'flex',alignItems:'center',gap:6,marginBottom:2 }}>
              <span style={{ fontSize:12,fontWeight:800,color:'#111',fontFamily:'system-ui' }}>{bike.name}</span>
              <span style={{ fontSize:8,fontWeight:700,background:'#C8102E10',color:'#C8102E',borderRadius:6,padding:'1px 5px',fontFamily:'system-ui' }}>{bike.tag}</span>
            </div>
            <span style={{ fontSize:10,color:'#888',fontFamily:'system-ui' }}>Ab {bike.price} / Tag</span>
          </div>
          {i===active && <div style={{ width:28,height:28,background:'#C8102E',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></div>}
        </div>
      ))}
      <div style={{ marginTop:'auto',background:'#C8102E',borderRadius:14,padding:'10px',textAlign:'center' }}>
        <span style={{ fontSize:12,fontWeight:800,color:'white',fontFamily:'system-ui' }}>Jetzt buchen →</span>
      </div>
    </div>
  )
}

// ── Phone mockup: Explore Map ────────────────────────────────────────────────
function ExploreMockup() {
  const pins = [
    { top:'18%',left:'22%',emoji:'🏰',color:'#8b5cf6',label:'Leuchtturm'  },
    { top:'38%',left:'62%',emoji:'🏖️',color:'#0ea5e9',label:'Weststrand'  },
    { top:'52%',left:'30%',emoji:'🌿',color:'#16a34a',label:'Dünenweg'    },
    { top:'28%',left:'78%',emoji:'🍽️',color:'#f59e0b',label:'Restaurant'  },
  ]
  const [active, setActive] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setActive(a => (a+1) % pins.length), 2000)
    return () => clearInterval(t)
  }, [])
  const pin = pins[active]
  return (
    <div style={{ height:'100%',position:'relative',overflow:'hidden' }}>
      <div style={{ position:'absolute',inset:0,background:'linear-gradient(160deg,#d4e8d4,#c8e0c8 40%,#b8d4e0)' }} />
      <svg style={{ position:'absolute',inset:0,width:'100%',height:'100%' }} viewBox="0 0 220 380" preserveAspectRatio="none">
        <path d="M0 190 Q55 170 110 180 Q165 190 220 170" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="5"/>
        <path d="M40 0 Q60 95 80 190 Q100 285 110 380" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="3"/>
        <path d="M0 100 Q110 120 220 90" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2"/>
      </svg>
      {pins.map((p,i) => (
        <div key={p.label} style={{ position:'absolute',top:p.top,left:p.left,transform:`translate(-50%,-100%) scale(${i===active?1.3:1})`,transition:'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)',zIndex:i===active?2:1 }}>
          <div style={{ width:28,height:36,position:'relative',filter:i===active?`drop-shadow(0 3px 8px ${p.color}80)`:'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>
            <svg viewBox="0 0 24 30" width="28" height="36" fill={i===active?p.color:'#888'} style={{ transition:'fill 0.3s' }}><path d="M12 1C6.48 1 2 5.48 2 11c0 6.75 10 18 10 18S22 17.75 22 11c0-5.52-4.48-10-10-10z"/><circle cx="12" cy="11" r="5" fill="white"/></svg>
            <span style={{ position:'absolute',top:3,left:'50%',transform:'translateX(-50%)',fontSize:10 }}>{p.emoji}</span>
          </div>
        </div>
      ))}
      <div style={{ position:'absolute',bottom:0,left:0,right:0,background:'white',borderRadius:'18px 18px 0 0',boxShadow:'0 -8px 32px rgba(0,0,0,0.12)',padding:'10px 14px 14px',transition:'all 0.35s ease' }}>
        <div style={{ width:32,height:3,background:'#e5e5e5',borderRadius:2,margin:'0 auto 10px' }} />
        <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:8 }}>
          <div style={{ width:36,height:36,borderRadius:10,background:`${pin.color}18`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0,border:`1px solid ${pin.color}25`,transition:'background 0.4s,border-color 0.4s' }}>{pin.emoji}</div>
          <div>
            <div style={{ fontSize:12,fontWeight:800,color:'#111',fontFamily:'system-ui',marginBottom:1 }}>{pin.label}</div>
            <div style={{ fontSize:9,color:'#999',fontFamily:'system-ui' }}>Norderney · Sehenswürdigkeit</div>
          </div>
        </div>
        <div style={{ background:pin.color,borderRadius:10,padding:'7px',textAlign:'center',transition:'background 0.4s' }}>
          <span style={{ fontSize:11,fontWeight:800,color:'white',fontFamily:'system-ui' }}>Fahrradroute berechnen →</span>
        </div>
      </div>
    </div>
  )
}

// ── Phone mockup: Pannenhilfe ────────────────────────────────────────────────
function ReportMockup() {
  const [phase, setPhase] = useState(0)
  // 0 = form  1 = locating  2 = success
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 2800)
    const t2 = setTimeout(() => setPhase(2), 4200)
    const t3 = setTimeout(() => setPhase(0), 7000)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  return (
    <div style={{ height:'100%', background:'#111', display:'flex', flexDirection:'column', padding:'16px 14px', overflow:'hidden' }}>

      {/* Badge */}
      <div style={{ display:'inline-flex', alignItems:'center', gap:5, background:'rgba(200,16,46,0.18)', border:'1px solid rgba(200,16,46,0.35)', borderRadius:20, padding:'3px 10px', marginBottom:10, alignSelf:'flex-start' }}>
        <span style={{ fontSize:9 }}>⚠️</span>
        <span style={{ fontSize:9, fontWeight:800, color:'#C8102E', letterSpacing:'0.1em', textTransform:'uppercase', fontFamily:'system-ui' }}>Pannenhilfe</span>
      </div>

      {/* Title */}
      <div style={{ fontSize:14, fontWeight:900, color:'white', fontFamily:'system-ui', lineHeight:1.25, marginBottom:12 }}>
        Problem mit<br />dem Fahrrad?
      </div>

      {phase === 2 ? (
        /* Success state */
        <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:10, textAlign:'center' }}>
          <div style={{ width:52, height:52, borderRadius:'50%', background:'rgba(22,163,74,0.15)', border:'2px solid rgba(22,163,74,0.4)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24 }}>✅</div>
          <div style={{ fontSize:12, fontWeight:900, color:'white', fontFamily:'system-ui' }}>Meldung eingegangen!</div>
          <div style={{ fontSize:10, color:'rgba(255,255,255,0.45)', fontFamily:'system-ui', lineHeight:1.5 }}>Wir sind so schnell<br />wie möglich bei dir.</div>
        </div>
      ) : (
        <>
          {/* Bike number field */}
          <div style={{ marginBottom:8 }}>
            <div style={{ display:'flex', alignItems:'baseline', gap:6, marginBottom:4 }}>
              <span style={{ fontSize:9, fontWeight:700, color:'rgba(255,255,255,0.7)', fontFamily:'system-ui' }}>Fahrradnummer</span>
              <span style={{ fontSize:8, color:'rgba(255,255,255,0.3)', fontFamily:'system-ui' }}>0001 – 1200</span>
            </div>
            <div style={{ background:'#1e1e1e', border:'1.5px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'9px 12px', fontSize:15, fontWeight:800, color:'rgba(255,255,255,0.25)', fontFamily:'monospace', letterSpacing:'0.15em' }}>
              z.B. &nbsp;0042
            </div>
            <div style={{ fontSize:8, color:'rgba(255,255,255,0.25)', fontFamily:'system-ui', marginTop:4 }}>Die Nummer findest du auf dem Aufkleber am Rahmen.</div>
          </div>

          {/* Location row */}
          <div style={{ marginBottom:8 }}>
            <div style={{ fontSize:9, fontWeight:700, color:'rgba(255,255,255,0.7)', fontFamily:'system-ui', marginBottom:4 }}>Dein Standort <span style={{ color:'rgba(255,255,255,0.3)', fontWeight:400 }}>empfohlen</span></div>
            <div style={{ background:'#1e1e1e', border:'1.5px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'9px 12px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                {phase === 1
                  ? <div style={{ width:12, height:12, borderRadius:'50%', border:'2px solid rgba(200,16,46,0.4)', borderTopColor:'#C8102E', animation:'navSpin 0.8s linear infinite', flexShrink:0 }} />
                  : <span style={{ fontSize:12, color:'#C8102E' }}>📍</span>}
                <span style={{ fontSize:10, fontWeight:600, color:'rgba(255,255,255,0.7)', fontFamily:'system-ui' }}>
                  {phase === 1 ? 'Wird ermittelt…' : 'Aktuellen Standort ermitteln'}
                </span>
              </div>
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
            </div>
          </div>

          {/* Problem textarea */}
          <div style={{ marginBottom:10 }}>
            <div style={{ fontSize:9, fontWeight:700, color:'rgba(255,255,255,0.7)', fontFamily:'system-ui', marginBottom:4 }}>Was ist das Problem? <span style={{ color:'rgba(255,255,255,0.3)', fontWeight:400 }}>optional</span></div>
            <div style={{ background:'#1e1e1e', border:'1.5px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'9px 12px', height:44, fontSize:10, color:'rgba(255,255,255,0.2)', fontFamily:'system-ui' }}>
              Beschreibe das Problem kurz…
            </div>
          </div>

          {/* Submit button */}
          <div style={{ marginTop:'auto', background:'#C8102E', borderRadius:12, padding:'10px 12px', display:'flex', alignItems:'center', justifyContent:'center', gap:6, boxShadow:'0 4px 16px rgba(200,16,46,0.4)' }}>
            <span style={{ fontSize:11 }}>⚠️</span>
            <span style={{ fontSize:11, fontWeight:800, color:'white', fontFamily:'system-ui' }}>Pannenhilfe anfordern</span>
          </div>
        </>
      )}
    </div>
  )
}

// ── Main section ─────────────────────────────────────────────────────────────
export default function FeatureShowcase() {
  const { locale } = useLocale()
  const de = locale === 'de'
  const [current, setCurrent] = useState(0)
  const [dir, setDir] = useState<'left' | 'right'>('right')
  const [animating, setAnimating] = useState(false)
  const touchStartX = useRef(0)
  const autoRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  const features = [
    {
      icon: <Navigation size={16} />,
      tag: de ? 'GPS Navigation' : 'GPS Navigation',
      title: de ? 'Echte Fahrradrouten mit\nTurn-by-Turn Navigation' : 'Real Cycling Routes with\nTurn-by-Turn Navigation',
      desc: de
        ? 'Starte eine Route zu jedem Punkt auf Norderney — mit GPS-Navigation direkt im Browser. Kein App-Download nötig.'
        : 'Start a route to any point on Norderney with GPS navigation right in your browser. No app download needed.',
      cta: de ? 'Karte öffnen' : 'Open map',
      href: '/tours',
      color: '#C8102E',
      glow: 'rgba(200,16,46,0.18)',
      mockup: <NavMockup />,
      num: '01',
    },
    {
      icon: <Bike size={16} />,
      tag: de ? 'Fahrrad mieten' : 'Bike Rental',
      title: de ? 'E-Bikes & City-Bikes —\nsofort online buchbar' : 'E-Bikes & City Bikes —\nBook Instantly Online',
      desc: de
        ? 'Von der klassischen Citybike bis zum E-Lastenrad für die ganze Familie. Online buchen, abholen, losfahren.'
        : 'From classic city bikes to e-cargo bikes for the whole family. Book online, pick up, and ride.',
      cta: de ? 'Bikes ansehen' : 'View bikes',
      href: '/bikes',
      color: '#16a34a',
      glow: 'rgba(22,163,74,0.18)',
      mockup: <BikeMockup />,
      num: '02',
    },
    {
      icon: <Map size={16} />,
      tag: de ? 'Insel entdecken' : 'Explore the Island',
      title: de ? 'Highlights, Strände &\nGeheimtipps entdecken' : 'Discover Highlights,\nBeaches & Hidden Gems',
      desc: de
        ? 'Kuratierte Pins mit Stränden, Sehenswürdigkeiten und lokalen Tipps — und direkt die Route zum Ziel berechnen.'
        : 'Curated pins with beaches, sights, and local tips — get a cycling route calculated directly to your destination.',
      cta: de ? 'Entdecken' : 'Explore',
      href: '/tours',
      color: '#7c3aed',
      glow: 'rgba(124,58,237,0.18)',
      mockup: <ExploreMockup />,
      num: '03',
    },
    {
      icon: <Wrench size={16} />,
      tag: de ? 'Pannenhilfe' : 'Roadside Help',
      title: de ? 'Problem mit dem Fahrrad?\nWir kommen zu dir' : 'Bike Problem?\nWe come to you',
      desc: de
        ? 'Gib einfach deine Fahrradnummer ein und sende uns deinen Standort — unser Team ist so schnell wie möglich bei dir.'
        : 'Simply enter your bike number and send us your location — our team will be with you as fast as possible.',
      cta: de ? 'Pannenhilfe' : 'Get help',
      href: '/#pannenhilfe',
      color: '#ea580c',
      glow: 'rgba(234,88,12,0.18)',
      mockup: <ReportMockup />,
      num: '04',
    },
  ]

  const resetAuto = useCallback(() => {
    if (autoRef.current) clearTimeout(autoRef.current)
    autoRef.current = setTimeout(() => {
      setDir('right')
      setAnimating(true)
      setTimeout(() => {
        setCurrent(c => (c + 1) % features.length)
        setAnimating(false)
      }, 420)
    }, 5000)
  }, [features.length])

  useEffect(() => {
    resetAuto()
    return () => { if (autoRef.current) clearTimeout(autoRef.current) }
  }, [current, resetAuto])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  function go(direction: 'left' | 'right') {
    if (animating) return
    setDir(direction)
    setAnimating(true)
    resetAuto()
    setTimeout(() => {
      setCurrent(c => direction === 'right'
        ? (c + 1) % features.length
        : (c - 1 + features.length) % features.length
      )
      setAnimating(false)
    }, 420)
  }

  const f = features[current]

  return (
    <section ref={sectionRef} style={{ background: '#0a0a0a', padding: '72px 0 80px', overflow: 'hidden' }}>
      <div className="container-site">

        {/* Section header */}
        <div style={{
          textAlign: 'center', marginBottom: 48,
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }}>
          <div style={{ display:'inline-flex',alignItems:'center',gap:8,background:'rgba(200,16,46,0.12)',border:'1px solid rgba(200,16,46,0.25)',borderRadius:20,padding:'5px 14px',marginBottom:16 }}>
            <div style={{ width:6,height:6,borderRadius:'50%',background:'#C8102E',boxShadow:'0 0 6px rgba(200,16,46,0.8)' }} />
            <span style={{ fontSize:11,fontWeight:700,color:'#C8102E',letterSpacing:'0.12em',textTransform:'uppercase',fontFamily:'system-ui' }}>
              {de ? 'Was dich erwartet' : 'What to expect'}
            </span>
          </div>
          <h2 style={{ fontSize:'clamp(22px,4vw,36px)',fontWeight:900,color:'white',letterSpacing:'-0.02em',lineHeight:1.2,margin:'0 0 10px',fontFamily:'system-ui' }}>
            {de ? 'Alles für deinen perfekten ' : 'Everything for your perfect '}
            <span style={{ color:'#C8102E' }}>{de ? 'Norderney-Urlaub' : 'Norderney holiday'}</span>
          </h2>
          <p style={{ fontSize:15,color:'rgba(255,255,255,0.4)',maxWidth:440,margin:'0 auto',fontFamily:'system-ui',lineHeight:1.6 }}>
            {de ? 'In einer App — Fahrrad buchen, Route planen, Insel entdecken.' : 'In one place — rent a bike, plan your route, discover the island.'}
          </p>
        </div>

        {/* Slider */}
        <div style={{
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(28px)',
          transition: 'opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s',
          position: 'relative',
        }}>

          {/* Card */}
          <div style={{
            background: '#111',
            border: `1px solid ${f.color}30`,
            borderRadius: 28,
            overflow: 'hidden',
            boxShadow: `0 0 80px ${f.glow}, 0 8px 40px rgba(0,0,0,0.4)`,
            transition: 'box-shadow 0.5s ease, border-color 0.5s ease',
            // Slide animation
            transform: animating
              ? `translateX(${dir === 'right' ? '-6%' : '6%'}) scale(0.97)`
              : 'translateX(0) scale(1)',
            opacity: animating ? 0 : 1,
            transition2: 'transform 0.38s cubic-bezier(0.4,0,0.2,1), opacity 0.38s ease',
          } as React.CSSProperties}
            className="feature-slide-card"
            onTouchStart={e => { touchStartX.current = e.touches[0].clientX }}
            onTouchEnd={e => {
              const dx = touchStartX.current - e.changedTouches[0].clientX
              if (Math.abs(dx) > 45) go(dx > 0 ? 'right' : 'left')
            }}
          >
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              minHeight: 380,
            }}
              className="feature-slide-inner"
            >
              {/* Phone mockup side */}
              <div style={{
                background: '#0d0d0d',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '28px 24px',
                borderRight: '1px solid rgba(255,255,255,0.05)',
              }}>
                <div style={{
                  width: 180, height: 320, borderRadius: 22,
                  overflow: 'hidden',
                  border: '2px solid rgba(255,255,255,0.08)',
                  boxShadow: `0 0 40px ${f.glow}, 0 20px 60px rgba(0,0,0,0.5)`,
                  position: 'relative', flexShrink: 0,
                }}>
                  {/* Notch */}
                  <div style={{ position:'absolute',top:0,left:'50%',transform:'translateX(-50%)',width:52,height:7,background:'#0d0d0d',zIndex:10,borderRadius:'0 0 7px 7px' }} />
                  {f.mockup}
                </div>
              </div>

              {/* Text side */}
              <div style={{ padding: '36px 36px 36px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16 }}>
                {/* Number + tag */}
                <div style={{ display:'flex',alignItems:'center',gap:12 }}>
                  <span style={{ fontSize:11,fontWeight:700,color:'rgba(255,255,255,0.15)',fontFamily:'system-ui',letterSpacing:'0.1em' }}>{f.num}</span>
                  <div style={{ display:'flex',alignItems:'center',gap:6,background:`${f.color}15`,border:`1px solid ${f.color}30`,borderRadius:20,padding:'4px 12px' }}>
                    <span style={{ color:f.color }}>{f.icon}</span>
                    <span style={{ fontSize:11,fontWeight:700,color:f.color,letterSpacing:'0.08em',textTransform:'uppercase',fontFamily:'system-ui' }}>{f.tag}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 style={{ fontSize:'clamp(18px,2.5vw,26px)',fontWeight:900,color:'white',lineHeight:1.25,margin:0,fontFamily:'system-ui',whiteSpace:'pre-line' }}>
                  {f.title}
                </h3>

                {/* Desc */}
                <p style={{ fontSize:14,color:'rgba(255,255,255,0.45)',lineHeight:1.7,margin:0,fontFamily:'system-ui',maxWidth:420 }}>
                  {f.desc}
                </p>

                {/* CTA */}
                <Link href={f.href} style={{
                  display:'inline-flex',alignItems:'center',gap:8,
                  background:f.color, color:'white',
                  borderRadius:14, padding:'12px 22px',
                  fontSize:14,fontWeight:800,textDecoration:'none',fontFamily:'system-ui',
                  alignSelf:'flex-start',
                  boxShadow:`0 4px 20px ${f.glow}`,
                  transition:'opacity 0.2s, transform 0.2s',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.88'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
                >
                  {f.cta} <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>

          {/* Nav arrows */}
          <button
            onClick={() => go('left')}
            style={{
              position:'absolute', top:'50%', left:-20, transform:'translateY(-50%)',
              width:44, height:44, borderRadius:'50%',
              background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)',
              color:'white', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
              transition:'background 0.2s, transform 0.2s',
              backdropFilter:'blur(8px)', zIndex:10,
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.15)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-50%) scale(1.08)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-50%) scale(1)' }}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => go('right')}
            style={{
              position:'absolute', top:'50%', right:-20, transform:'translateY(-50%)',
              width:44, height:44, borderRadius:'50%',
              background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)',
              color:'white', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
              transition:'background 0.2s, transform 0.2s',
              backdropFilter:'blur(8px)', zIndex:10,
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.15)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-50%) scale(1.08)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-50%) scale(1)' }}
          >
            <ChevronRight size={20} />
          </button>

          {/* Dot indicators + counter */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:16, marginTop:24 }}>
            <div style={{ display:'flex', gap:7 }}>
              {features.map((feat,i) => (
                <button
                  key={i}
                  onClick={() => { if (i !== current) go(i > current ? 'right' : 'left') }}
                  style={{
                    width: i === current ? 28 : 8, height:8, borderRadius:4, border:'none', cursor:'pointer', padding:0,
                    background: i === current ? f.color : 'rgba(255,255,255,0.18)',
                    transition:'width 0.35s cubic-bezier(0.4,0,0.2,1), background 0.35s ease',
                    boxShadow: i === current ? `0 0 8px ${f.color}80` : 'none',
                  }}
                />
              ))}
            </div>
            <span style={{ fontSize:11,fontWeight:600,color:'rgba(255,255,255,0.25)',fontFamily:'system-ui' }}>
              {current + 1} / {features.length}
            </span>
          </div>
        </div>
      </div>

      {/* CSS for responsive card layout */}
      <style>{`
        .feature-slide-card {
          transition: transform 0.38s cubic-bezier(0.4,0,0.2,1), opacity 0.38s ease,
                      box-shadow 0.5s ease, border-color 0.5s ease !important;
        }
        @media (max-width: 640px) {
          .feature-slide-inner {
            grid-template-columns: 1fr !important;
          }
          .feature-slide-inner > div:first-child {
            border-right: none !important;
            border-bottom: 1px solid rgba(255,255,255,0.05) !important;
            padding: 24px 24px 20px !important;
          }
          .feature-slide-inner > div:last-child {
            padding: 24px 22px 28px !important;
          }
        }
      `}</style>
    </section>
  )
}
