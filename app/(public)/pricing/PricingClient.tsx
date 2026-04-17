'use client'

import { useState } from 'react'
import { Mail, Phone, Zap, Battery, Gauge, Weight, ChevronDown, ChevronUp, Clock } from 'lucide-react'
import { useLocale } from '@/components/LocaleProvider'

const CONTACT_EMAIL = 'drahtesel-ney@outlook.com'
const CONTACT_PHONE = 'tel:+4949324980397'
const CONTACT_PHONE_DISPLAY = '+49 4932 4980397'

const bike = {
  id: 'stormguard-eplus-1',
  badge: { de: 'E-Trekking', en: 'E-Trekking' },
  name: 'Giant Stormguard E+ 1',
  subtitle: { de: 'CUES Edition 2024', en: 'CUES Edition 2024' },
  price: '5.899',
  description: {
    de: 'Das SUV unter den E-Bikes. Leistungsstarker Motor, vollständige Federung, Carbon-Riemenantrieb und einzigartiger Cargo-Träger — für den täglichen Pendelweg genauso wie für mehrtägige Abenteuer.',
    en: 'The SUV of e-bikes. Powerful motor, full suspension, carbon belt drive and a unique floating cargo rack — built for daily commutes as well as multi-day adventures.',
  },
  colors: ['Blue Dragonfly', 'Black'],
  specs: {
    motor:   { de: 'SyncDrive Pro2 — 85 Nm (Yamaha)', en: 'SyncDrive Pro2 — 85 Nm (Yamaha)' },
    battery: { de: 'EnergyPak Smart 800 Wh', en: 'EnergyPak Smart 800 Wh' },
    range:   { de: '70 – 250 km (je nach Bedingungen)', en: '70 – 250 km (depending on conditions)' },
    gears:   { de: 'Shimano Cues 11-Gang', en: 'Shimano Cues 11-speed' },
    brakes:  { de: 'Shimano Deore 4-Kolben Hydraulik, 203 mm', en: 'Shimano Deore 4-piston hydraulic, 203mm' },
    frame:   { de: 'ALUXX SL Aluminium, 100 mm Federung', en: 'ALUXX SL Aluminium, 100mm full suspension' },
    wheels:  { de: '27.5" Tubeless-Ready', en: '27.5" Tubeless-Ready' },
    weight:  { de: '30,3 kg (Größe L)', en: '30.3 kg (size L)' },
    sizes:   { de: 'S / M / L / XL', en: 'S / M / L / XL' },
    lights:  { de: 'Supernova M99 Mini Pro 260 Lux (vorne) + Supernova E3 (hinten)', en: 'Supernova M99 Mini Pro 260 lux (front) + Supernova E3 (rear)' },
    lock:    { de: 'ABUS Xplus Akku-Schloss integriert', en: 'Integrated ABUS Xplus battery lock' },
    rack:    { de: 'Floating MIK Gepäckträger (15 kg)', en: 'Floating MIK cargo rack (15 kg)' },
  },
  highlights: {
    de: ['Carbon-Riemenantrieb (10.000+ km wartungsfrei)', 'Dropper Seatpost integriert', 'RideDash EVO Farbdisplay (kabellos)', 'Giant RideControl App (ANT+)', '60% Akku in 2 Std. 15 Min.'],
    en: ['Carbon belt drive (10,000+ km maintenance-free)', 'Integrated dropper seatpost', 'RideDash EVO color display (wireless)', 'Giant RideControl App (ANT+)', '60% charge in 2h 15min'],
  },
}

export default function ShopClient() {
  const { locale } = useLocale()
  const de = locale === 'de'
  const [specsOpen, setSpecsOpen] = useState(false)
  const [selectedColor, setSelectedColor] = useState(bike.colors[0])

  const mailSubject = de
    ? `Anfrage: ${bike.name}`
    : `Enquiry: ${bike.name}`
  const mailBody = de
    ? `Hallo,\n\nich interessiere mich für das ${bike.name} (${selectedColor}).\n\nBitte kontaktiert mich mit weiteren Informationen.\n\nVielen Dank`
    : `Hello,\n\nI am interested in the ${bike.name} (${selectedColor}).\n\nPlease contact me with more information.\n\nThank you`

  return (
    <div className="pt-20 min-h-screen bg-white">

      {/* Hero */}
      <div className="bg-brand-muted border-b border-gray-100">
        <div className="container-site py-12 text-center">
          <span className="inline-block bg-brand-red/10 text-brand-red text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
            {de ? 'Fahrrad Shop' : 'Bike Shop'}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-black mb-4">
            {de ? 'Fahrräder & E-Bikes kaufen' : 'Buy Bikes & E-Bikes'}
          </h1>
          <p className="text-brand-gray text-lg max-w-xl mx-auto">
            {de
              ? 'Hochwertige Fahrräder direkt vom lokalen Händler. Persönliche Beratung, faire Preise.'
              : 'Premium bikes from your local dealer. Personal advice, fair prices.'}
          </p>
        </div>
      </div>

      {/* Coming soon banner */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="container-site py-4 flex items-center justify-center gap-3 text-center flex-wrap">
          <Clock size={16} className="text-amber-600 flex-shrink-0" />
          <p className="text-amber-800 text-sm font-medium">
            {de
              ? 'Online-Kauf demnächst verfügbar — Jetzt direkt anfragen und reservieren.'
              : 'Online purchase coming soon — Enquire and reserve directly now.'}
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(mailSubject)}`}
            className="text-amber-800 font-bold text-sm underline underline-offset-2 hover:text-amber-900 transition-colors whitespace-nowrap"
          >
            {de ? 'Jetzt anfragen →' : 'Enquire now →'}
          </a>
        </div>
      </div>

      <div className="container-site py-16">

        {/* Product card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_40px_rgba(0,0,0,0.08)] overflow-hidden">

            {/* Image area */}
            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center"
              style={{ minHeight: 280 }}>
              {/* Placeholder until real image */}
              <div className="flex flex-col items-center gap-4 py-16 px-8 text-center">
                <div className="w-20 h-20 rounded-2xl bg-brand-red/10 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#C8102E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="40" height="40">
                    <circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/>
                    <path d="M15 6H9l-3 8h12l-3-8z"/><path d="M12 6V3"/><path d="M15 6l2 5"/>
                  </svg>
                </div>
                <p className="text-sm text-gray-400 font-medium">
                  {de ? 'Produktfoto folgt in Kürze' : 'Product photo coming soon'}
                </p>
              </div>

              {/* Badge */}
              <div className="absolute top-4 left-4">
                <span className="bg-brand-red text-white text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                  {de ? bike.badge.de : bike.badge.en}
                </span>
              </div>

              {/* Coming Soon overlay tag */}
              <div className="absolute top-4 right-4">
                <span className="bg-amber-400 text-amber-900 text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                  {de ? 'Demnächst online' : 'Coming Soon'}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-10">

              {/* Title + price */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-brand-red mb-1">
                    {de ? bike.subtitle.de : bike.subtitle.en}
                  </p>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-brand-black leading-tight">
                    {bike.name}
                  </h2>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-xs text-gray-400 font-medium mb-0.5">{de ? 'Preis ab' : 'Price from'}</p>
                  <p className="text-3xl md:text-4xl font-extrabold text-brand-black">
                    €{bike.price}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{de ? 'inkl. MwSt.' : 'incl. VAT'}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed mb-6 text-[15px]">
                {de ? bike.description.de : bike.description.en}
              </p>

              {/* Color selector */}
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                  {de ? 'Farbe' : 'Color'}: <span className="text-brand-black font-bold normal-case tracking-normal">{selectedColor}</span>
                </p>
                <div className="flex gap-2">
                  {bike.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                        selectedColor === color
                          ? 'border-brand-red text-brand-red bg-brand-red/5'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Key specs grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  { icon: <Zap size={15} />, label: de ? 'Motor' : 'Motor', value: de ? '85 Nm Yamaha' : '85 Nm Yamaha' },
                  { icon: <Battery size={15} />, label: de ? 'Akku' : 'Battery', value: '800 Wh' },
                  { icon: <Gauge size={15} />, label: de ? 'Reichweite' : 'Range', value: de ? 'bis 250 km' : 'up to 250 km' },
                  { icon: <Weight size={15} />, label: de ? 'Gewicht' : 'Weight', value: '30,3 kg' },
                ].map(s => (
                  <div key={s.label} className="bg-gray-50 rounded-2xl p-4 flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-brand-red">{s.icon}
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{s.label}</span>
                    </div>
                    <p className="text-[13px] font-bold text-brand-black">{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Full specs accordion */}
              <button
                onClick={() => setSpecsOpen(v => !v)}
                className="flex items-center gap-2 text-sm font-bold text-brand-gray hover:text-brand-black transition-colors mb-2"
              >
                {specsOpen
                  ? <><ChevronUp size={16} />{de ? 'Technische Daten ausblenden' : 'Hide full specs'}</>
                  : <><ChevronDown size={16} />{de ? 'Alle technischen Daten anzeigen' : 'Show all specs'}</>
                }
              </button>

              {specsOpen && (
                <div className="bg-gray-50 rounded-2xl p-5 mb-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                  {Object.entries(bike.specs).map(([key, val]) => (
                    <div key={key} className="flex flex-col gap-0.5 border-b border-gray-100 pb-3">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        {key === 'motor' ? (de ? 'Motor' : 'Motor') :
                         key === 'battery' ? (de ? 'Akku' : 'Battery') :
                         key === 'range' ? (de ? 'Reichweite' : 'Range') :
                         key === 'gears' ? (de ? 'Schaltung' : 'Gears') :
                         key === 'brakes' ? (de ? 'Bremsen' : 'Brakes') :
                         key === 'frame' ? (de ? 'Rahmen' : 'Frame') :
                         key === 'wheels' ? (de ? 'Laufräder' : 'Wheels') :
                         key === 'weight' ? (de ? 'Gewicht' : 'Weight') :
                         key === 'sizes' ? (de ? 'Größen' : 'Sizes') :
                         key === 'lights' ? (de ? 'Beleuchtung' : 'Lights') :
                         key === 'lock' ? (de ? 'Schloss' : 'Lock') :
                         key === 'rack' ? (de ? 'Gepäckträger' : 'Rack') : key}
                      </span>
                      <span className="text-[13px] text-gray-700 font-medium">{de ? val.de : val.en}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Highlights */}
              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                  {de ? 'Highlights' : 'Highlights'}
                </p>
                <div className="flex flex-col gap-2">
                  {(de ? bike.highlights.de : bike.highlights.en).map(h => (
                    <div key={h} className="flex items-center gap-2.5 text-[13px] text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-red flex-shrink-0" />
                      {h}
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`}
                  className="flex-1 flex items-center justify-center gap-2.5 bg-brand-red text-white font-extrabold text-[15px] py-4 rounded-2xl hover:bg-brand-red-dark transition-all active:scale-[0.98] shadow-[0_8px_24px_rgba(200,16,46,0.3)]"
                >
                  <Mail size={18} />
                  {de ? 'Per E-Mail anfragen' : 'Enquire by Email'}
                </a>
                <a
                  href={CONTACT_PHONE}
                  className="flex-1 flex items-center justify-center gap-2.5 bg-gray-900 text-white font-extrabold text-[15px] py-4 rounded-2xl hover:bg-gray-800 transition-all active:scale-[0.98]"
                >
                  <Phone size={18} />
                  {de ? 'Jetzt anrufen' : 'Call Us Now'}
                </a>
              </div>

              <p className="text-center text-xs text-gray-400 mt-4">
                {de
                  ? 'Wir antworten in der Regel innerhalb von 24 Stunden. Persönliche Beratung auch vor Ort.'
                  : 'We usually respond within 24 hours. In-person consultation also available.'}
              </p>
            </div>
          </div>
        </div>

        {/* More bikes coming soon */}
        <div className="max-w-4xl mx-auto mt-10">
          <div className="border-2 border-dashed border-gray-200 rounded-3xl p-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
                <circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/>
                <path d="M15 6H9l-3 8h12l-3-8z"/><path d="M12 6V3"/><path d="M15 6l2 5"/>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-400 mb-2">
              {de ? 'Weitere Modelle folgen' : 'More models coming soon'}
            </h3>
            <p className="text-sm text-gray-400 max-w-xs mx-auto">
              {de
                ? 'Unser Sortiment wird laufend erweitert. Bei Interesse an weiteren Modellen — einfach anfragen.'
                : 'Our range is continuously growing. Interested in other models? Just ask us.'}
            </p>
          </div>
        </div>

      </div>

      {/* Contact strip */}
      <div className="bg-brand-black mt-8">
        <div className="container-site py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-white font-extrabold text-xl mb-1">
              {de ? 'Fragen? Wir helfen dir persönlich.' : 'Questions? We are here for you.'}
            </h3>
            <p className="text-gray-400 text-sm">
              {de
                ? 'Beratung, Probefahrt, Finanzierung — alles persönlich und unkompliziert.'
                : 'Advice, test rides, financing — personal and straightforward.'}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="flex items-center gap-2 bg-white text-brand-black font-bold text-sm px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Mail size={16} />
              {CONTACT_EMAIL}
            </a>
            <a
              href={CONTACT_PHONE}
              className="flex items-center gap-2 bg-brand-red text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-brand-red-dark transition-colors"
            >
              <Phone size={16} />
              {CONTACT_PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </div>

    </div>
  )
}
