'use client'

import { useState, useEffect, useCallback, useRef, Suspense, Component } from 'react'
import type { ReactNode } from 'react'
import dynamic from 'next/dynamic'
import { Map, X, Route, ChevronRight, Bike, Clock } from 'lucide-react'
import { useLocale } from '@/components/LocaleProvider'
import { DEFAULT_PINS } from '@/lib/interest-pins'
import type { InterestPin } from '@/lib/interest-pins'
import type { ActiveRoute, RouteStep } from '@/components/explore/ExploreMap'
import StartLocationModal from '@/components/tours/v2/StartLocationModal'
import type { StartLocation } from '@/components/tours/v2/StartLocationModal'
import PinSheet from '@/components/explore/PinSheet'
import RouteBar from '@/components/explore/RouteBar'
import NavigationView from '@/components/explore/NavigationView'
import PinDialog from '@/components/tours/PinDialog'
import NavStartSplash from '@/components/tours/NavStartSplash'
import { validatePin, hasPinSession, savePinSession } from '@/lib/weekly-pins'
import type { WeeklyPin } from '@/lib/weekly-pins'
import Link from 'next/link'

const ExploreMap = dynamic(() => import('@/components/explore/ExploreMap'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-gradient-to-br from-[#e8f0e8] to-[#dce8f0] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-brand-gray font-medium">Karte wird geladen…</p>
      </div>
    </div>
  ),
})

// ── Haversine distance helper ─────────────────────────────────────────────────
function haversineDistance(a: [number, number], b: [number, number]): number {
  const R = 6371000
  const lat1 = (a[0] * Math.PI) / 180
  const lat2 = (b[0] * Math.PI) / 180
  const dLat = ((b[0] - a[0]) * Math.PI) / 180
  const dLon = ((b[1] - a[1]) * Math.PI) / 180
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s))
}

// ── Decode Valhalla encoded polyline (precision 6) ───────────────────────────
function decodePolyline(encoded: string): [number, number][] {
  const factor = 1e6
  const result: [number, number][] = []
  let idx = 0, lat = 0, lng = 0
  while (idx < encoded.length) {
    let b, shift = 0, res = 0
    do { b = encoded.charCodeAt(idx++) - 63; res |= (b & 0x1f) << shift; shift += 5 } while (b >= 0x20)
    lat += (res & 1) ? ~(res >> 1) : (res >> 1)
    shift = 0; res = 0
    do { b = encoded.charCodeAt(idx++) - 63; res |= (b & 0x1f) << shift; shift += 5 } while (b >= 0x20)
    lng += (res & 1) ? ~(res >> 1) : (res >> 1)
    result.push([lat / factor, lng / factor])
  }
  return result
}

// Map Valhalla maneuver type → OSRM-style type + modifier
function valhallaManeuver(type: number): { type: string; modifier: string } {
  const t = (type === 1 || type === 2 || type === 3) ? 'depart'
    : (type === 4 || type === 5 || type === 6) ? 'arrive'
    : (type === 8 || type === 7) ? 'continue'
    : 'turn'
  const m = (type === 9 || type === 18) ? 'slight right'
    : (type === 10) ? 'right'
    : (type === 11) ? 'sharp right'
    : (type === 12 || type === 13) ? 'uturn'
    : (type === 14) ? 'sharp left'
    : (type === 15) ? 'left'
    : (type === 16 || type === 19) ? 'slight left'
    : 'straight'
  return { type: t, modifier: m }
}

// ── Valhalla cycling route — routes through all bike paths incl. footways ────
async function fetchCyclingRoute(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number }
): Promise<ActiveRoute> {
  const body = {
    locations: [
      { lat: from.lat, lon: from.lng },
      { lat: to.lat,   lon: to.lng   },
    ],
    costing: 'bicycle',
    costing_options: {
      bicycle: {
        bicycle_type: 'Cross', // routes through paths, gravel, cycleways
        use_roads: 0.3,        // prefer paths over roads
        use_hills: 0.2,
        use_ferry: 0,
      },
    },
    units: 'km',
  }

  const res = await fetch('https://valhalla1.openstreetmap.de/route', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error('Valhalla request failed')
  const data = await res.json()
  if (!data.trip?.legs?.length) throw new Error('No cycling route found')

  const leg = data.trip.legs[0]
  const coords = decodePolyline(leg.shape)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const steps: RouteStep[] = (leg.maneuvers ?? []).map((m: any) => {
    const { type, modifier } = valhallaManeuver(m.type)
    return {
      type,
      modifier,
      distance: (m.length ?? 0) * 1000,   // km → m
      duration: m.time ?? 0,
      name: (m.street_names ?? []).join(', '),
      maneuverLocation: coords[m.begin_shape_index ?? 0] ?? [from.lat, from.lng],
    }
  })

  return {
    coords,
    distance: (data.trip.summary.length ?? 0) * 1000,  // km → m
    duration: data.trip.summary.time ?? 0,
    steps,
  }
}

// ── Main app ──────────────────────────────────────────────────────────────────
function ExploreApp() {
  const { locale } = useLocale()
  const de = locale === 'de'

  const [showModal, setShowModal] = useState(true)
  const [startLocation, setStartLocation] = useState<StartLocation | null>(null)
  const [pins, setPins] = useState<InterestPin[]>(DEFAULT_PINS)
  const [selectedPin, setSelectedPin] = useState<InterestPin | null>(null)
  const [activeRoute, setActiveRoute] = useState<ActiveRoute | null>(null)
  const [routeLoading, setRouteLoading] = useState(false)
  const [routeError, setRouteError] = useState<string | null>(null)
  const [navigating, setNavigating] = useState(false)
  const [currentStepIdx, setCurrentStepIdx] = useState(0)
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null)
  const [distanceTraveled, setDistanceTraveled] = useState(0)
  const lastNavPosRef = useRef<{ lat: number; lng: number } | null>(null)
  const lastAdvancedStepRef = useRef<number>(-1)
  const [showNavSplash, setShowNavSplash] = useState(false)
  const [showPinDialog, setShowPinDialog] = useState(false)
  const [weeklyPins, setWeeklyPins] = useState<WeeklyPin[]>([])

  // ── Route planner ──────────────────────────────────────────────────────────
  type PlannerMode = 'idle' | 'placing-start' | 'placing-end' | 'routing'
  const [plannerMode, setPlannerMode] = useState<PlannerMode>('idle')
  const [plannerStart, setPlannerStart] = useState<[number, number] | null>(null)
  const [plannerEnd, setPlannerEnd] = useState<[number, number] | null>(null)
  const [showRoutePanel, setShowRoutePanel] = useState(false)
  const [predefinedRoutes, setPredefinedRoutes] = useState<{
    id: string; name: {de:string;en:string}; description: {de:string;en:string};
    distance: string; duration: string; difficulty: string; emoji: string;
    start: [number,number]; end: [number,number]
  }[]>([])

  // Load weekly pins once
  useEffect(() => {
    fetch('/api/weekly-pins')
      .then(r => r.json())
      .then((data: WeeklyPin[]) => setWeeklyPins(data))
      .catch(() => {})
  }, [])

  // Load predefined routes
  useEffect(() => {
    fetch('/api/predefined-routes')
      .then(r => r.json())
      .then(data => setPredefinedRoutes(data))
      .catch(() => {})
  }, [])

  // ── Map tap handler (route planner) ───────────────────────────────────────
  const handleMapClick = useCallback(async (lat: number, lng: number) => {
    if (plannerMode === 'placing-start') {
      setPlannerStart([lat, lng])
      setPlannerEnd(null)
      setActiveRoute(null)
      setPlannerMode('placing-end')
    } else if (plannerMode === 'placing-end') {
      setPlannerEnd([lat, lng])
      setPlannerMode('routing')
      setRouteLoading(true)
      setRouteError(null)
      // Synthetic destination pin so RouteBar/NavigationView work
      const destPin: InterestPin = {
        id: 'planner-end',
        title: { de: 'Dein Ziel', en: 'Your Destination' },
        description: { de: 'Selbst gewählter Zielpunkt', en: 'Custom destination point' },
        tip: { de: '', en: '' },
        category: 'landmark',
        lat, lng,
      }
      setSelectedPin(destPin)
      try {
        const start = plannerStart!
        const route = await fetchCyclingRoute({ lat: start[0], lng: start[1] }, { lat, lng })
        setActiveRoute(route)
      } catch {
        setRouteError(de ? 'Keine Route gefunden. Bitte andere Punkte wählen.' : 'No route found. Please choose different points.')
      }
      setRouteLoading(false)
      setPlannerMode('idle')
    }
  }, [plannerMode, plannerStart, de])

  // ── Load a predefined route ────────────────────────────────────────────────
  const handleLoadPredefined = useCallback(async (route: typeof predefinedRoutes[0]) => {
    setShowRoutePanel(false)
    setPlannerStart(route.start)
    setPlannerEnd(route.end)
    setActiveRoute(null)
    setRouteLoading(true)
    setRouteError(null)
    const destPin: InterestPin = {
      id: 'planner-end',
      title: route.name,
      description: route.description,
      tip: { de: '', en: '' },
      category: 'landmark',
      lat: route.end[0], lng: route.end[1],
    }
    setSelectedPin(destPin)
    try {
      const r = await fetchCyclingRoute(
        { lat: route.start[0], lng: route.start[1] },
        { lat: route.end[0], lng: route.end[1] }
      )
      setActiveRoute(r)
    } catch {
      setRouteError(de ? 'Route konnte nicht geladen werden.' : 'Could not load route.')
    }
    setRouteLoading(false)
  }, [de, predefinedRoutes])

  const handleCancelPlanner = useCallback(() => {
    setPlannerMode('idle')
    setPlannerStart(null)
    setPlannerEnd(null)
  }, [])

  // Load admin-curated pins (override defaults if any exist)
  useEffect(() => {
    fetch('/interest-pins.json')
      .then(r => r.json())
      .then((data: InterestPin[]) => {
        if (Array.isArray(data) && data.length > 0) setPins(data)
      })
      .catch(() => {/* use defaults */})
  }, [])

  const handleStartConfirm = useCallback((loc: StartLocation | null) => {
    setStartLocation(loc)
    setShowModal(false)
  }, [])

  const handlePinSelect = useCallback((pin: InterestPin) => {
    setSelectedPin(pin)
    setActiveRoute(null)
    setRouteError(null)
  }, [])

  const handlePinClose = useCallback(() => {
    setSelectedPin(null)
    setActiveRoute(null)
    setRouteError(null)
  }, [])

  const handleGetRoute = useCallback(async () => {
    if (!selectedPin || !startLocation) return
    setRouteLoading(true)
    setRouteError(null)
    try {
      const route = await fetchCyclingRoute(startLocation, { lat: selectedPin.lat, lng: selectedPin.lng })
      setActiveRoute(route)
    } catch {
      setRouteError(
        de
          ? 'Keine Fahrradroute gefunden. Bitte versuche es erneut.'
          : 'No cycling route found. Please try again.'
      )
    }
    setRouteLoading(false)
  }, [selectedPin, startLocation, de])

  const handleClearRoute = useCallback(() => {
    setActiveRoute(null)
    setRouteError(null)
    setNavigating(false)
    setCurrentStepIdx(0)
    setPlannerStart(null)
    setPlannerEnd(null)
    setPlannerMode('idle')
  }, [])

  const doStartNavigation = useCallback(() => {
    setNavigating(true)
    setCurrentStepIdx(0)
    setDistanceTraveled(0)
    lastNavPosRef.current = null
    lastAdvancedStepRef.current = -1
    setShowNavSplash(true)
  }, [])

  const handleStartNavigation = useCallback(() => {
    // If already unlocked this week, go instantly
    if (weeklyPins.length > 0 && hasPinSession(weeklyPins)) {
      doStartNavigation()
    } else {
      setShowPinDialog(true)
    }
  }, [weeklyPins, doStartNavigation])

  const handlePinSuccess = useCallback(() => {
    savePinSession(weeklyPins)
    setShowPinDialog(false)
    doStartNavigation()
  }, [weeklyPins, doStartNavigation])

  const handlePinValidate = useCallback((input: string) => {
    return validatePin(input, weeklyPins)
  }, [weeklyPins])

  const handleEndNavigation = useCallback(() => {
    setNavigating(false)
    setCurrentStepIdx(0)
    setDistanceTraveled(0)
    lastNavPosRef.current = null
  }, [])

  // Track GPS position, accumulate distance traveled, auto-advance steps
  const handlePositionUpdate = useCallback((lat: number, lng: number) => {
    setUserPos({ lat, lng })

    if (!navigating) return

    // Accumulate real distance traveled (for accurate % progress)
    if (lastNavPosRef.current) {
      const d = haversineDistance(
        [lastNavPosRef.current.lat, lastNavPosRef.current.lng],
        [lat, lng]
      )
      if (d > 1) setDistanceTraveled(prev => prev + d)
    }
    lastNavPosRef.current = { lat, lng }

    // Auto-advance to next step when near maneuver point
    if (!activeRoute?.steps) return
    const step = activeRoute.steps[currentStepIdx]
    if (!step) return
    const dist = haversineDistance([lat, lng], step.maneuverLocation)
    // Guard: only advance if not already advanced from this step index
    if (dist < 25 && currentStepIdx < activeRoute.steps.length - 1 && lastAdvancedStepRef.current !== currentStepIdx) {
      lastAdvancedStepRef.current = currentStepIdx
      setCurrentStepIdx(i => i + 1)
    }
  }, [navigating, activeRoute, currentStepIdx])

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: '100dvh' }}
    >
      {/* Map */}
      <ExploreMap
        startLocation={startLocation}
        pins={pins}
        selectedPin={selectedPin}
        activeRoute={activeRoute}
        navigating={navigating}
        locale={locale}
        onPinSelect={handlePinSelect}
        onPositionUpdate={handlePositionUpdate}
        planningMode={plannerMode === 'placing-start' || plannerMode === 'placing-end'}
        plannerStart={plannerStart}
        plannerEnd={plannerEnd}
        onMapClick={handleMapClick}
      />

      {/* Top bar */}
      {!activeRoute && (
        <div className="absolute top-0 left-0 right-0 z-[1100] px-3 flex items-center gap-2 pointer-events-none"
          style={{ paddingTop: 'max(12px, env(safe-area-inset-top))' }}>
          <div className="pointer-events-auto">
            <Link
              href="/"
              className="h-10 px-3 bg-white/95 backdrop-blur rounded-xl shadow-md flex items-center gap-1.5 text-brand-gray hover:text-brand-black transition-colors"
            >
              <X size={16} />
              <span className="text-[12px] font-bold">{de ? 'Verlassen' : 'Exit'}</span>
            </Link>
          </div>

          <div className="pointer-events-auto flex-1">
            <div className="bg-white/95 backdrop-blur rounded-xl shadow-md px-3.5 py-2.5 flex items-center gap-2.5">
              <Map size={15} className="text-brand-red flex-shrink-0" />
              <span className="text-[13px] font-extrabold text-brand-black truncate">
                {de ? 'Norderney entdecken' : 'Explore Norderney'}
              </span>
            </div>
          </div>

          {/* Route planner button */}
          <div className="pointer-events-auto">
            <button
              onClick={() => setShowRoutePanel(true)}
              className="h-10 px-3 bg-white/95 backdrop-blur rounded-xl shadow-md flex items-center gap-1.5 text-[12px] font-bold text-brand-gray hover:text-brand-black transition-colors"
            >
              <Route size={15} className="text-brand-red" />
              <span className="hidden sm:inline">{de ? 'Route' : 'Route'}</span>
            </button>
          </div>

          {/* Start location indicator */}
          {startLocation ? (
            <div className="pointer-events-auto">
              <button
                onClick={() => setShowModal(true)}
                className="h-10 px-3 bg-white/95 backdrop-blur rounded-xl shadow-md flex items-center gap-1.5 text-[12px] font-bold text-brand-gray hover:text-brand-black transition-colors max-w-[120px]"
              >
                <span>🏨</span>
                <span className="truncate">{startLocation.label}</span>
              </button>
            </div>
          ) : (
            <div className="pointer-events-auto">
              <button
                onClick={() => setShowModal(true)}
                className="h-10 px-3 bg-brand-red text-white rounded-xl shadow-md flex items-center gap-1.5 text-[12px] font-bold transition-colors"
              >
                📍 {de ? 'Standort' : 'Location'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Navigation overlay (full turn-by-turn) */}
      {navigating && activeRoute && selectedPin && (
        <NavigationView
          pin={selectedPin}
          steps={activeRoute.steps}
          stepIdx={currentStepIdx}
          totalDistance={activeRoute.distance}
          distanceTraveled={distanceTraveled}
          userLat={userPos?.lat}
          userLng={userPos?.lng}
          locale={locale}
          onExit={handleEndNavigation}
        />
      )}

      {/* Route bar (route calculated, not yet navigating) */}
      {activeRoute && !navigating && selectedPin && (
        <RouteBar
          pin={selectedPin}
          route={activeRoute}
          locale={locale}
          onClear={handleClearRoute}
          onStartNavigation={handleStartNavigation}
        />
      )}

      {/* Route error */}
      {routeError && (
        <div className="absolute top-20 left-3 right-3 z-[1100] bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-sm text-red-700 shadow-lg">
          {routeError}
        </div>
      )}

      {/* Route planner instruction banner */}
      {(plannerMode === 'placing-start' || plannerMode === 'placing-end' || plannerMode === 'routing') && (
        <div className="absolute bottom-6 left-3 right-3 z-[1060] flex flex-col items-center gap-2">
          <div className="bg-brand-black/90 backdrop-blur text-white rounded-2xl px-5 py-4 shadow-2xl w-full max-w-sm mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-sm flex-shrink-0 ${plannerMode === 'placing-end' ? 'bg-brand-red' : 'bg-green-600'}`}>
                {plannerMode === 'placing-end' || plannerMode === 'routing' ? 'B' : 'A'}
              </div>
              <p className="text-sm font-semibold leading-snug">
                {plannerMode === 'placing-start' && (de ? 'Tippe auf die Karte um den Startpunkt zu setzen' : 'Tap on the map to set your start point')}
                {plannerMode === 'placing-end' && (de ? 'Jetzt Zielpunkt auf der Karte antippen' : 'Now tap the map to set your destination')}
                {plannerMode === 'routing' && (de ? 'Route wird berechnet…' : 'Calculating route…')}
              </p>
            </div>
            {/* Step indicators */}
            <div className="flex items-center gap-2 mb-3">
              <div className={`flex-1 h-1.5 rounded-full ${plannerStart ? 'bg-green-500' : 'bg-white/20'}`} />
              <div className={`flex-1 h-1.5 rounded-full ${plannerEnd ? 'bg-brand-red' : 'bg-white/20'}`} />
            </div>
            <button
              onClick={handleCancelPlanner}
              className="w-full text-center text-xs text-white/50 hover:text-white/80 transition-colors"
            >
              {de ? 'Abbrechen' : 'Cancel'}
            </button>
          </div>
        </div>
      )}

      {/* Route loading spinner (planner) */}
      {routeLoading && plannerMode === 'idle' && !activeRoute && (
        <div className="absolute inset-0 z-[1060] flex items-center justify-center pointer-events-none">
          <div className="bg-white rounded-2xl px-6 py-4 shadow-xl flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-brand-red border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-semibold text-gray-700">{de ? 'Route wird berechnet…' : 'Calculating route…'}</span>
          </div>
        </div>
      )}

      {/* Pin info sheet — hidden during active navigation and for planner pins */}
      {selectedPin && selectedPin.id !== 'planner-end' && !navigating && plannerMode === 'idle' && (
        <PinSheet
          pin={selectedPin}
          locale={locale}
          routeLoading={routeLoading}
          hasRoute={!!activeRoute}
          onGetRoute={handleGetRoute}
          onClose={handlePinClose}
        />
      )}

      {/* Hint when no start location set */}
      {!startLocation && !showModal && !selectedPin && (
        <div className="absolute bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-[1050] pointer-events-none">
          <div className="bg-black/70 backdrop-blur text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-xl whitespace-nowrap">
            {de
              ? '📍 Setze deinen Startpunkt um Routen zu berechnen'
              : '📍 Set your start point to get cycling routes'}
          </div>
        </div>
      )}

      {/* Start location modal */}
      {showModal && (
        <StartLocationModal
          tourColor="#C8102E"
          locale={locale}
          onConfirm={handleStartConfirm}
          onCancel={() => setShowModal(false)}
        />
      )}

      {/* Route panel — custom planner + predefined routes */}
      {showRoutePanel && (
        <div className="absolute inset-0 z-[1200] flex flex-col justify-end" onClick={() => setShowRoutePanel(false)}>
          <div
            className="bg-white rounded-t-3xl shadow-2xl overflow-hidden max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-gray-200 rounded-full" />
            </div>

            <div className="px-5 pb-8 pt-3">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-extrabold text-gray-900">{de ? 'Route planen' : 'Plan a Route'}</h2>
                <button onClick={() => setShowRoutePanel(false)} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors">
                  <X size={16} />
                </button>
              </div>

              {/* Custom 2-pin route */}
              <button
                onClick={() => { setShowRoutePanel(false); setPlannerStart(null); setPlannerEnd(null); setActiveRoute(null); setSelectedPin(null); setPlannerMode('placing-start') }}
                className="w-full flex items-center gap-4 bg-brand-black text-white rounded-2xl p-4 mb-5 hover:bg-gray-900 transition-colors active:scale-[0.98]"
              >
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Route size={22} className="text-white" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-extrabold text-sm">{de ? 'Eigene Route erstellen' : 'Create custom route'}</p>
                  <p className="text-white/60 text-xs mt-0.5">{de ? 'Tippe 2 Punkte auf der Karte' : 'Tap 2 points on the map'}</p>
                </div>
                <ChevronRight size={18} className="text-white/40" />
              </button>

              {/* Predefined routes */}
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">{de ? 'Vorgeschlagene Touren' : 'Suggested Tours'}</p>
              <div className="flex flex-col gap-3">
                {predefinedRoutes.map(r => (
                  <button
                    key={r.id}
                    onClick={() => handleLoadPredefined(r)}
                    className="flex items-center gap-4 bg-gray-50 border border-gray-100 rounded-2xl p-4 hover:bg-gray-100 transition-colors active:scale-[0.98] text-left w-full"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
                      {r.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-extrabold text-sm text-gray-900">{de ? r.name.de : r.name.en}</p>
                      <p className="text-gray-500 text-xs mt-0.5 truncate">{de ? r.description.de : r.description.en}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-gray-400">
                          <Bike size={11} />{r.distance}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-gray-400">
                          <Clock size={11} />{r.duration}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${r.difficulty === 'easy' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                          {r.difficulty === 'easy' ? (de ? 'Leicht' : 'Easy') : (de ? 'Mittel' : 'Medium')}
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-gray-300 flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cinematic navigation-start splash */}
      {showNavSplash && (
        <NavStartSplash
          pin={selectedPin}
          totalDistance={activeRoute?.distance ?? 0}
          locale={locale}
          onDone={() => setShowNavSplash(false)}
        />
      )}

      {/* PIN gate — shown before first navigation each week */}
      {showPinDialog && (
        <PinDialog
          locale={locale}
          onSuccess={handlePinSuccess}
          onValidate={handlePinValidate}
        />
      )}
    </div>
  )
}

// ── Error boundary ─────────────────────────────────────────────────────────────
class MapErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error: Error) { return { error } }
  render() {
    if (this.state.error) {
      return (
        <div className="w-full flex flex-col items-center justify-center gap-4 px-6 text-center" style={{ height: 'calc(100svh - 64px)' }}>
          <p className="text-brand-gray text-sm">Karte konnte nicht geladen werden.</p>
          <button className="btn-primary px-6 py-2 text-sm" onClick={() => window.location.reload()}>
            Neu laden
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default function ToursPage() {
  return (
    <MapErrorBoundary>
      <Suspense fallback={
        <div className="w-full flex items-center justify-center" style={{ height: 'calc(100svh - 64px)' }}>
          <div className="w-10 h-10 border-4 border-brand-red border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <ExploreApp />
      </Suspense>
    </MapErrorBoundary>
  )
}
