'use client'

import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react'
import { useLocale } from '@/components/LocaleProvider'

export default function ContactPage() {
  const { locale } = useLocale()
  const de = locale === 'de'

  const contactItems = [
    {
      icon: <Phone size={20} />,
      title: de ? 'Anrufen' : 'Call Us',
      value: '+49 4932 4980397',
      sub: de ? 'Täglich 09:00 – 18:00 Uhr' : 'Daily 09:00 – 18:00',
      href: 'tel:+4949324980397',
    },
    {
      icon: <MessageCircle size={20} />,
      title: 'WhatsApp',
      value: de ? 'Schreib uns auf WhatsApp' : 'Message us on WhatsApp',
      sub: de ? 'Antwort meist innerhalb von 30 Minuten' : 'Usually responds within 30 minutes',
      href: 'https://wa.me/4949324980397',
    },
    {
      icon: <Mail size={20} />,
      title: 'E-Mail',
      value: 'info@drahtesel-norderney.de',
      sub: de ? 'Wir antworten innerhalb weniger Stunden' : 'We reply within a few hours',
      href: 'mailto:info@drahtesel-norderney.de',
    },
    {
      icon: <MapPin size={20} />,
      title: de ? 'Besuche uns' : 'Visit Us',
      value: 'Herrenpfad 21-22, 26548 Norderney',
      sub: de ? 'Walk-ins willkommen während der Öffnungszeiten' : 'Walk-ins welcome during opening hours',
      href: 'https://maps.app.goo.gl/drahtesel-norderney',
    },
    {
      icon: <Clock size={20} />,
      title: de ? 'Öffnungszeiten' : 'Opening Hours',
      value: de ? 'Mo–So: 09:00 – 18:00 Uhr' : 'Mon–Sun: 09:00 – 18:00',
      sub: de ? 'Täglich geöffnet, auch feiertags' : 'Open every day including public holidays',
      href: null,
    },
  ]

  const topics = de
    ? [
        { value: '', label: 'Thema wählen...' },
        { value: 'booking', label: 'Buchungsfrage' },
        { value: 'group', label: 'Gruppenmiete' },
        { value: 'availability', label: 'Verfügbarkeit' },
        { value: 'cancellation', label: 'Stornierung / Änderung' },
        { value: 'other', label: 'Sonstiges' },
      ]
    : [
        { value: '', label: 'Select a topic...' },
        { value: 'booking', label: 'Booking question' },
        { value: 'group', label: 'Group rental' },
        { value: 'availability', label: 'Bike availability' },
        { value: 'cancellation', label: 'Cancellation / change' },
        { value: 'other', label: 'Other' },
      ]

  return (
    <div className="pt-20 min-h-screen bg-white">
      <div className="bg-brand-muted border-b border-gray-200">
        <div className="container-site py-12 text-center">
          <h1 className="text-4xl font-extrabold text-brand-black mb-3">
            {de ? 'Kontakt' : 'Contact Us'}
          </h1>
          <p className="text-brand-gray text-lg max-w-lg mx-auto">
            {de
              ? 'Fragen, Gruppenanfragen oder Beratung bei der Fahrradwahl? Wir sind für dich da.'
              : 'Questions, group bookings, or just want advice on which bike to pick? We are here.'}
          </p>
        </div>
      </div>

      <div className="container-site py-12 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Contact info */}
          <div>
            <h2 className="text-2xl font-bold text-brand-black mb-6">
              {de ? 'So erreichst du uns' : 'Get in Touch'}
            </h2>
            <div className="flex flex-col gap-5">
              {contactItems.map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-brand-black text-sm mb-0.5">{item.title}</div>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith('http') ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        className="text-brand-red font-medium hover:text-brand-red-dark transition-colors break-all"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <div className="text-brand-gray font-medium">{item.value}</div>
                    )}
                    <div className="text-xs text-brand-gray mt-0.5">{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Map embed */}
            <div className="mt-8 rounded-2xl overflow-hidden shadow-card aspect-[4/3]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2361.600558834844!2d7.142452476985155!3d53.707563047634736!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b605508bb2322b%3A0x13da1a8112caedfb!2sDrahtesel%20Fahrradverleih!5e0!3m2!1sde!2sde!4v1774556924331!5m2!1sde!2sde"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Drahtesel Fahrradverleih Norderney"
              />
            </div>
          </div>

          {/* Contact form */}
          <div>
            <h2 className="text-2xl font-bold text-brand-black mb-6">
              {de ? 'Nachricht senden' : 'Send a Message'}
            </h2>
            <form className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-brand-black mb-1.5">
                    {de ? 'Vorname' : 'First Name'}
                  </label>
                  <input
                    type="text"
                    placeholder={de ? 'Dein Vorname' : 'Your first name'}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-black mb-1.5">
                    {de ? 'Nachname' : 'Last Name'}
                  </label>
                  <input
                    type="text"
                    placeholder={de ? 'Dein Nachname' : 'Your last name'}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-brand-black mb-1.5">E-Mail</label>
                <input
                  type="email"
                  placeholder="deine@email.de"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-brand-black mb-1.5">
                  {de ? 'Betreff' : 'Subject'}
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all text-brand-gray">
                  {topics.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-brand-black mb-1.5">
                  {de ? 'Nachricht' : 'Message'}
                </label>
                <textarea
                  rows={5}
                  placeholder={de ? 'Deine Nachricht...' : 'Your message...'}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all resize-none"
                />
              </div>
              <button type="submit" className="btn-primary py-4">
                {de ? 'Nachricht senden' : 'Send Message'}
              </button>
              <p className="text-xs text-brand-gray text-center">
                {de
                  ? 'Wir antworten in der Regel innerhalb weniger Stunden. Für dringende Anliegen bitte anrufen.'
                  : 'We typically respond within a few hours. For urgent matters, please call us.'}
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
