'use client'

import Link from 'next/link'
import { Heart, Award, Users, Bike } from 'lucide-react'
import { useLocale } from '@/components/LocaleProvider'

export default function AboutPage() {
  const { locale } = useLocale()
  const de = locale === 'de'

  const stats = [
    { value: '2018', label: de ? 'Gegründet' : 'Founded' },
    { value: '30+', label: de ? 'Fahrräder' : 'Bikes in fleet' },
    { value: '4.9★', label: de ? 'Google Bewertung' : 'Google rating' },
    { value: '1500+', label: de ? 'Zufriedene Mieter' : 'Happy renters' },
  ]

  const values = [
    {
      icon: <Heart size={24} />,
      title: de ? 'Lokal zuerst' : 'Local First',
      desc: de ? 'Wir sind ein Nachbarschaftsbetrieb, keine Plattform. Dein Geld bleibt in der Stadt.' : 'We are a neighbourhood business, not a platform. Your money stays in the city.'
    },
    {
      icon: <Award size={24} />,
      title: de ? 'Qualitätsräder' : 'Quality Bikes',
      desc: de ? 'Wir vermieten nur Fahrräder, die wir selbst fahren würden. Gewartet, getestet, fertig.' : 'We only rent bikes we would ride ourselves. Maintained, tested, ready.'
    },
    {
      icon: <Users size={24} />,
      title: de ? 'Persönlicher Service' : 'Personal Service',
      desc: de ? 'Echte Menschen, echter Support. Wir beantworten Anrufe und Nachrichten, keine Bots.' : 'Real people, real support. We answer calls and messages, not bots.'
    },
    {
      icon: <Bike size={24} />,
      title: de ? 'Leidenschaft fürs Radfahren' : 'Love for Cycling',
      desc: de ? 'Das ist nicht nur ein Geschäft. Wir glauben aufrichtig, dass Fahrräder Städte besser machen.' : 'This is not just a business. We genuinely believe bikes make cities better.'
    },
  ]

  return (
    <div className="pt-20 min-h-screen bg-white">
      {/* Header */}
      <div className="bg-brand-black text-white">
        <div className="container-site py-16 md:py-20">
          <div className="max-w-2xl">
            <div className="text-brand-red text-sm font-bold uppercase tracking-widest mb-4">
              {de ? 'Über uns' : 'About Us'}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-5 leading-tight">
              {de ? <>Wir sind Drahtesel.<br />Lokaler Fahrradverleih.</> : <>We are Drahtesel.<br />A Local Bike Rental.</>}
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              {de
                ? 'Seit 2018 helfen wir Menschen dabei, unsere Stadt mit dem Fahrrad zu erkunden. Keine Plattform, kein Depot — ein echtes lokales Unternehmen, geführt von Menschen, die das Radfahren lieben.'
                : 'Since 2018, we have been helping people explore our city by bike. Not a platform, not a depot — a real local business run by people who love cycling.'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-brand-red text-white">
        <div className="container-site py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-extrabold mb-1">{s.value}</div>
                <div className="text-sm text-white/80">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container-site py-16">
        {/* Story */}
        <div className="max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-brand-black mb-6">
            {de ? 'Unsere Geschichte' : 'Our Story'}
          </h2>
          <div className="prose prose-lg text-brand-gray leading-relaxed space-y-4">
            {de ? (
              <>
                <p>Drahtesel entstand aus einer einfachen Frustration: Ein Fahrrad in der Stadt zu mieten war entweder zu kompliziert, zu teuer oder zu unpersönlich. Das wollten wir ändern.</p>
                <p>Wir haben eine kleine Flotte hochwertiger, gut gewarteter Fahrräder aufgebaut und etwas angeboten, was die großen Plattformen nicht konnten — echtes lokales Wissen, persönlichen Service und Fahrräder, die wirklich fahrbereit sind.</p>
                <p>Jedes Fahrrad in unserer Flotte wird vor jeder Vermietung professionell gewartet. Wir kennen die besten Routen. Wir können dir sagen, wo man parkt, wo man Kaffee bekommt und wie man die Touristenmassen meidet. Das ist der Drahtesel-Unterschied.</p>
              </>
            ) : (
              <>
                <p>Drahtesel started with a simple frustration: renting a bike in the city was either too complicated, too expensive, or too impersonal. We wanted to change that.</p>
                <p>We built a small fleet of quality, well-maintained bikes and offered something the big platforms could not — real local knowledge, personal service, and bikes that are actually ready to ride.</p>
                <p>Every bike in our fleet is professionally serviced before each rental. We know the best routes. We can tell you where to park, where to get coffee, and how to avoid the tourist crowds. That is the Drahtesel difference.</p>
              </>
            )}
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-brand-black mb-10 text-center">
            {de ? 'Wofür wir stehen' : 'What We Stand For'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="text-center p-6 rounded-2xl bg-brand-muted">
                <div className="w-12 h-12 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center mx-auto mb-4">
                  {v.icon}
                </div>
                <h3 className="font-bold text-brand-black mb-2">{v.title}</h3>
                <p className="text-sm text-brand-gray leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link href="/bikes" className="btn-primary px-10 py-4">
            {de ? 'Unsere Fahrräder' : 'Browse Our Bikes'}
          </Link>
        </div>
      </div>
    </div>
  )
}
