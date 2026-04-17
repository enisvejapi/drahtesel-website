'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Zap } from 'lucide-react'
import { useLocale } from '@/components/LocaleProvider'

const FEATURED = [
  {
    id: 'city',
    image: '/bikes/City-Bike.jpg',
    badge: null,
    eBike: false,
    name: { de: 'City Bike', en: 'City Bike' },
    category: { de: 'Stadtrad', en: 'City Bike' },
  },
  {
    id: 'ebike',
    image: '/bikes/E-Bike-City.png',
    badge: { de: 'Beliebt', en: 'Popular' },
    eBike: true,
    name: { de: 'E-Bike City', en: 'E-Bike City' },
    category: { de: 'E-Bike', en: 'E-Bike' },
  },
  {
    id: 'lastenrad',
    image: '/bikes/E-Lastenrad-CHIKE.jpg',
    badge: null,
    eBike: true,
    name: { de: 'E-Lastenrad CHIKE', en: 'E-Cargo Bike CHIKE' },
    category: { de: 'E-Lastenrad', en: 'E-Cargo Bike' },
  },
]

export default function FeaturedBikes() {
  const { t, locale } = useLocale()
  const de = locale === 'de'

  return (
    <section className="section-pad bg-brand-muted">
      <div className="container-site">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <h2 className="section-title">{t('featured.title')}</h2>
            <p className="section-subtitle">{t('featured.subtitle')}</p>
          </div>
          <Link href="/bikes" className="btn-ghost whitespace-nowrap">
            {t('featured.viewAll')} <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURED.map((bike) => (
            <Link key={bike.id} href="/bikes" className="card group">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={bike.image}
                  alt={de ? bike.name.de : bike.name.en}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {bike.badge && (
                  <div className="absolute top-3 left-3 bg-brand-red text-white text-xs font-bold px-3 py-1 rounded-full">
                    {de ? bike.badge.de : bike.badge.en}
                  </div>
                )}
                {bike.eBike && (
                  <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <Zap size={11} />E-Bike
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="text-xs font-semibold text-brand-red uppercase tracking-wider mb-1">
                  {de ? bike.category.de : bike.category.en}
                </div>
                <h3 className="font-bold text-lg text-brand-black mb-3">
                  {de ? bike.name.de : bike.name.en}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-brand-gray">
                    {de ? 'Preise & Verfügbarkeit online' : 'Prices & availability online'}
                  </span>
                  <span className="btn-ghost text-sm">
                    {t('featured.viewBook')} <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
