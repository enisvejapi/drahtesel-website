'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, CalendarDays, CreditCard, Bike, ChevronDown, ChevronUp } from 'lucide-react'
import { useLocale } from '@/components/LocaleProvider'

// Static FAQs as fallback (bilingual)
const DE_FAQS = [
  { question: 'Was ist in jeder Miete enthalten?', answer: 'Jede Miete beinhaltet Helm, Schloss und Flickzeug. Je nach Fahrrad gibt es auch Korb, Satteltasche, Stadtplan oder Kinderhelme. Schau auf der jeweiligen Fahrradseite nach.' },
  { question: 'Kann ich meine Buchung stornieren?', answer: 'Ja. Kostenlose Stornierung bis 24 Stunden vor der Abholung. Stornierungen weniger als 24 Stunden vorher sind nicht erstattungsfähig.' },
  { question: 'Wird eine Kaution verlangt?', answer: 'Für Standard-Cityräder keine Kaution. Für E-Bikes und Lastenräder gilt eine rückerstattbare Kaution von 50–100 €.' },
  { question: 'Was passiert bei verspäteter Rückgabe?', answer: 'Bitte melde dich so früh wie möglich, wenn du dich verspätest. Späte Rückgaben werden anteilig stündlich berechnet.' },
  { question: 'Muss ich einen Ausweis mitbringen?', answer: 'Ja, bitte bringe einen gültigen Personalausweis oder Reisepass zur Abholung mit.' },
  { question: 'Was passiert, wenn das Fahrrad eine Panne hat?', answer: 'Ruf unsere Support-Hotline an. Wir helfen dir so schnell wie möglich oder organisieren Ersatz. Alle Fahrräder werden vor jeder Miete professionell gewartet.' },
]

const EN_FAQS = [
  { question: "What's included with every rental?", answer: "Every rental includes a helmet, a quality lock, and a repair kit. Depending on the bike, you may also get a basket, saddlebag, city map, or child helmets. Check the individual bike page for what's included." },
  { question: 'Can I cancel my booking?', answer: 'Yes. You can cancel free of charge up to 24 hours before your scheduled pickup. Cancellations made less than 24 hours before are non-refundable.' },
  { question: 'Is there a deposit required?', answer: 'A deposit may be required at pickup depending on the bike type. For standard city bikes, no deposit is required. For e-bikes and cargo bikes, a refundable deposit of €50–€100 applies.' },
  { question: 'What happens if I return late?', answer: "If you're running late, please call or message us as soon as possible. Late returns are charged at a prorated hourly rate." },
  { question: 'Do I need to bring ID?', answer: 'Yes, please bring a valid government-issued ID or passport at pickup.' },
  { question: 'What if the bike breaks down?', answer: 'In the unlikely event of a mechanical issue, call our support line. We will do our best to assist you or arrange a replacement.' },
]

export default function HowItWorksPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const { locale } = useLocale()
  const de = locale === 'de'

  const steps = [
    {
      icon: <Search size={32} />,
      step: '01',
      title: de ? 'Flotte durchstöbern' : 'Browse Our Fleet',
      description: de
        ? 'Entdecke unsere gesamte Fahrradauswahl. Filtere nach Typ, Dauer und Preis. Jedes Fahrrad zeigt volle Ausstattung, Fotos und Preise — keine Überraschungen.'
        : 'Explore our full range of bikes. Filter by type, duration, and price. Every bike shows full specs, photos, and pricing upfront — no surprises.',
      tip: de ? 'Unsicher welches Fahrrad? Das City-Bike ist perfekt für Erstmieter.' : 'Not sure which bike? The City Bike is perfect for first-time renters.',
    },
    {
      icon: <CalendarDays size={32} />,
      step: '02',
      title: de ? 'Datum & Standort wählen' : 'Choose Dates & Location',
      description: de
        ? 'Wähle deinen Mietzeitraum — Ganztag, mehrtägig oder wöchentlich. Bevorzugten Abholort auswählen. Echtzeit-Verfügbarkeit prüfen.'
        : 'Select your rental period — full day, multi-day, or weekly. Choose your pickup location. Check real-time availability.',
      tip: de ? 'Same-Day-Buchung möglich, solange Fahrräder verfügbar sind.' : 'You can book same-day if bikes are available.',
    },
    {
      icon: <CreditCard size={32} />,
      step: '03',
      title: de ? 'Sicher buchen' : 'Complete Secure Booking',
      description: de
        ? 'Du wirst zu unserem Buchungspartner Mietrad weitergeleitet. Dein Fahrrad und deine Daten bleiben gespeichert. Sofortige E-Mail-Bestätigung.'
        : "You'll be redirected to our trusted booking partner Mietrad for secure payment. Your bike and dates are saved. Instant email confirmation.",
      tip: de ? 'Kein Konto nötig. Gast-Checkout verfügbar.' : 'No account needed. Guest checkout available.',
    },
    {
      icon: <Bike size={32} />,
      step: '04',
      title: de ? 'Abholen & losfahren' : 'Pick Up & Ride',
      description: de
        ? 'Zeige deine Buchungsbestätigung an unserem Abholort. Wir übergeben Fahrrad, Helm, Schloss und alles Weitere. Viel Spaß!'
        : 'Show your booking confirmation at our pickup location. We hand over your bike, helmet, lock, and everything else included. Off you go.',
      tip: de ? 'Bitte Ausweis mitbringen. Wir passen die Sattelhöhe gerne an.' : 'Bring a valid ID. We will do a quick bike fitting if needed.',
    },
  ]

  const faqs = de ? DE_FAQS : EN_FAQS

  return (
    <div className="pt-20 min-h-screen bg-white">
      <div className="bg-brand-muted border-b border-gray-200">
        <div className="container-site py-12 text-center">
          <h1 className="text-4xl font-extrabold text-brand-black mb-3">
            {de ? 'So funktioniert es' : 'How It Works'}
          </h1>
          <p className="text-brand-gray text-lg max-w-xl mx-auto">
            {de ? 'Vom Stöbern bis zum Losfahren — der gesamte Prozess in 4 einfachen Schritten.' : 'From browsing to riding — the whole process in 4 simple steps.'}
          </p>
        </div>
      </div>

      <div className="container-site py-16">
        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {steps.map((step) => (
            <div key={step.step} className="flex gap-5 p-6 rounded-2xl bg-brand-muted">
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-brand-red text-white flex items-center justify-center">
                {step.icon}
              </div>
              <div>
                <div className="text-xs font-bold text-brand-red uppercase tracking-widest mb-1">
                  {de ? 'Schritt' : 'Step'} {step.step}
                </div>
                <h3 className="text-lg font-bold text-brand-black mb-2">{step.title}</h3>
                <p className="text-sm text-brand-gray leading-relaxed mb-3">{step.description}</p>
                <div className="flex items-start gap-2 bg-white rounded-lg p-3 text-xs text-brand-gray">
                  <span className="text-brand-red font-bold flex-shrink-0">Tipp:</span>
                  {step.tip}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto" id="faq">
          <h2 className="text-3xl font-bold text-brand-black mb-8 text-center">
            {de ? 'Häufig gestellte Fragen' : 'Frequently Asked Questions'}
          </h2>
          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between gap-4 p-5 text-left bg-white hover:bg-brand-muted transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-semibold text-brand-black">{faq.question}</span>
                  {openFaq === i
                    ? <ChevronUp size={18} className="flex-shrink-0 text-brand-red" />
                    : <ChevronDown size={18} className="flex-shrink-0 text-brand-gray" />
                  }
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-sm text-brand-gray leading-relaxed border-t border-gray-100 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-brand-gray mb-4">
              {de ? 'Noch Fragen?' : 'Still have questions?'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact" className="btn-primary">
                {de ? 'Kontakt' : 'Contact Us'}
              </Link>
              <Link href="/bikes" className="btn-secondary">
                {de ? 'Fahrräder' : 'Browse Bikes'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
