'use client'

import Link from 'next/link'
import { ArrowRight, CheckCircle2, Phone, Mail, Bus, Footprints } from 'lucide-react'
import { useLocale } from '@/components/LocaleProvider'
import dynamic from 'next/dynamic'

const LiveMap = dynamic(() => import('@/components/LiveMap'), { ssr: false, loading: () => (
  <div className="w-full h-[420px] md:h-[560px] bg-gray-100 flex items-center justify-center">
    <div className="text-brand-gray text-sm">Karte wird geladen…</div>
  </div>
)})


export default function LocationsPage() {
  const { locale } = useLocale()
  const de = locale === 'de'

  const walkSteps = de
    ? [
        { n: '1', text: 'Vom Hafen einfach Richtung Stadtzentrum laufen.' },
        { n: '2', text: 'Der Weg wird automatisch zur Jann-Berghaus-Straße.' },
        { n: '3', text: 'Im Zentrum in den Herrenpfad einbiegen — wir sind bei Nr. 21–22.' },
      ]
    : [
        { n: '1', text: 'From the harbour, walk straight towards the town centre.' },
        { n: '2', text: 'The road becomes Jann-Berghaus-Straße.' },
        { n: '3', text: 'In the centre, turn into Herrenpfad — find us at No. 21–22.' },
      ]

  const busSteps = de
    ? [
        { n: '1', text: 'Am Hafen die Buslinie 1 in Richtung Stadtzentrum nehmen — Einstieg an der Haltestelle Hafen.' },
        { n: '2', text: 'Drei Haltestellen fahren und an der Haltestelle Winterstraße Mitte aussteigen.' },
        { n: '3', text: 'Von dort nur wenige Schritte: in den Herrenpfad einbiegen — wir sind bei Nr. 21–22.' },
      ]
    : [
        { n: '1', text: 'At the harbour, take Bus Line 1 towards the town centre — board at the Hafen stop.' },
        { n: '2', text: 'Ride three stops and get off at Winterstraße Mitte.' },
        { n: '3', text: 'From there it is just a few steps: turn into Herrenpfad — find us at No. 21–22.' },
      ]

  return (
    <div className="pt-20 min-h-screen bg-white">

      {/* Live interactive map */}
      <LiveMap de={de} />

      {/* How to get here */}
      <div className="container-site py-14">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold text-brand-black mb-2">
            {de ? 'So findest du uns' : 'How to Find Us'}
          </h2>
          <p className="text-brand-gray mb-10">
            {de ? 'Vom Fährhafen Norderney — zu Fuß oder mit dem Bus.' : 'From the Norderney ferry terminal — on foot or by bus.'}
          </p>

          {/* Walking */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-brand-black flex items-center justify-center flex-shrink-0">
              <Footprints size={16} className="text-white" />
            </div>
            <span className="font-extrabold text-brand-black text-base">
              {de ? 'Zu Fuß vom Hafen' : 'On foot from the harbour'}
            </span>
            <span className="text-xs text-gray-400 font-medium ml-1">{de ? '~ 10 Min.' : '~ 10 min.'}</span>
          </div>

          <div className="flex flex-col mb-10">
            {walkSteps.map((step, i) => (
              <div key={step.n}>
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-9 h-9 rounded-full bg-brand-red text-white font-bold text-sm flex items-center justify-center flex-shrink-0">
                      {step.n}
                    </div>
                    {i < walkSteps.length - 1 && (
                      <div className="flex flex-col items-center gap-1 mt-1 mb-1">
                        <div className="w-0.5 h-3 bg-gray-200 rounded" />
                        <div className="w-0.5 h-3 bg-gray-300 rounded animate-pulse" />
                        <div className="w-0.5 h-3 bg-gray-200 rounded" />
                        <ArrowRight size={12} className="text-brand-red rotate-90 animate-bounce" />
                      </div>
                    )}
                  </div>
                  <div className="pt-1.5 pb-4 text-brand-gray leading-relaxed">{step.text}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">{de ? 'oder' : 'or'}</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Bus */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-brand-red flex items-center justify-center flex-shrink-0">
              <Bus size={16} className="text-white" />
            </div>
            <span className="font-extrabold text-brand-black text-base">
              {de ? 'Mit dem Bus (Linie 1)' : 'By bus (Line 1)'}
            </span>
            <span className="text-xs text-gray-400 font-medium ml-1">{de ? '~ 5 Min.' : '~ 5 min.'}</span>
          </div>

          <div className="bg-brand-red/5 border border-brand-red/15 rounded-2xl px-5 pt-5 pb-1 mb-12">
            {busSteps.map((step, i) => (
              <div key={step.n}>
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-9 h-9 rounded-full bg-brand-red text-white font-bold text-sm flex items-center justify-center flex-shrink-0">
                      {step.n}
                    </div>
                    {i < busSteps.length - 1 && (
                      <div className="flex flex-col items-center gap-1 mt-1 mb-1">
                        <div className="w-0.5 h-3 bg-red-200 rounded" />
                        <div className="w-0.5 h-3 bg-red-300 rounded animate-pulse" />
                        <div className="w-0.5 h-3 bg-red-200 rounded" />
                        <ArrowRight size={12} className="text-brand-red rotate-90 animate-bounce" />
                      </div>
                    )}
                  </div>
                  <div className="pt-1.5 pb-4 text-brand-gray leading-relaxed">{step.text}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick facts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {/* Address */}
            <div className="bg-brand-muted rounded-2xl p-5">
              <div className="text-xs font-bold text-brand-red uppercase tracking-wider mb-1">{de ? 'Adresse' : 'Address'}</div>
              <div className="text-brand-black font-bold text-base leading-snug">Herrenpfad 21-22<br /><span className="font-semibold">26548 Norderney</span></div>
            </div>

            {/* Hours */}
            <div className="bg-brand-muted rounded-2xl p-5">
              <div className="text-xs font-bold text-brand-red uppercase tracking-wider mb-1">{de ? 'Öffnungszeiten' : 'Hours'}</div>
              <div className="text-brand-black font-bold text-base leading-snug">Mo–So / Mon–Sun<br /><span className="font-semibold">09:00 – 18:00 Uhr</span></div>
            </div>

            {/* Phone — call on mobile, call + email on desktop */}
            <div className="bg-brand-muted rounded-2xl p-5">
              <div className="text-xs font-bold text-brand-red uppercase tracking-wider mb-2">{de ? 'Kontakt' : 'Contact'}</div>
              <a href="tel:+4949324980397" className="block text-brand-black font-bold text-sm hover:text-brand-red transition-colors mb-2">
                +49 4932 4980397
              </a>
              {/* Mobile: call only */}
              <a
                href="tel:+4949324980397"
                className="sm:hidden flex items-center gap-1.5 bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors w-full justify-center"
              >
                <Phone size={13} />
                {de ? 'Anrufen' : 'Call'}
              </a>
              {/* Desktop: call + email side by side */}
              <div className="hidden sm:flex gap-2">
                <a
                  href="tel:+4949324980397"
                  className="flex-1 flex items-center justify-center gap-1.5 bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors"
                >
                  <Phone size={13} />
                  {de ? 'Anrufen' : 'Call'}
                </a>
                <a
                  href="mailto:info@drahtesel-norderney.de"
                  className="flex-1 flex items-center justify-center gap-1.5 bg-brand-black hover:bg-gray-800 text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors"
                >
                  <Mail size={13} />
                  E-Mail
                </a>
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-2xl p-5">
            <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-800">
              {de
                ? 'Hauptabholort und Rückgabestation. Fahrradanpassung auf Wunsch. Walk-ins willkommen.'
                : 'Main pickup and return location. Bike fitting available on request. Walk-ins welcome.'}
            </p>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link href="/bikes" className="btn-primary px-8 py-4">
              {de ? 'Fahrrad buchen' : 'Book a Bike'}
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
