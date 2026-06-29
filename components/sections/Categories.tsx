'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { useLocale } from '@/components/LocaleProvider'

export default function Categories() {
  const { t } = useLocale()

  const categories = [
    { name: t('categories.cityBike'),   icon: '/emoji/citybike_emoji.png',       description: t('categories.cityBikeDesc'), slug: 'city-bike'   },
    { name: t('categories.eBike'),      icon: '/emoji/ebike_emoji.png',           description: t('categories.eBikeDesc'),    slug: 'e-bike'      },
    { name: t('categories.kinder'),     icon: '/emoji/kinderrad_emoji.png',       description: t('categories.kinderDesc'),   slug: 'kinderrad'   },
    { name: t('categories.anhaenger'), icon: '/emoji/hundeanhaenger_emoji.png',  description: t('categories.anhaengerDesc'), slug: 'anhaenger'  },
    { name: t('categories.eLastenrad'), icon: '/emoji/elastenrad_emoji.png',      description: t('categories.eLastenradDesc'), slug: 'e-lastenrad' },
    { name: t('categories.eMobil'),     icon: '/emoji/emobile_emoji.png',         description: t('categories.eMobilDesc'),   slug: 'e-mobil'     },
  ]

  return (
    <section className="pt-10 pb-16 md:pt-12 md:pb-20 bg-brand-muted">
      <div className="container-site">
        <div className="text-center mb-10">
          <h2 className="section-title">{t('categories.title')}</h2>
          <p className="section-subtitle mx-auto">
            {t('categories.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/bikes?category=${cat.slug}`}
              className="group card p-5 flex flex-col items-center text-center hover:-translate-y-1 transition-all duration-200"
            >
              <div className="w-12 h-12 mb-3 relative">
                <Image src={cat.icon} alt={cat.name} fill className="object-contain" />
              </div>
              <span className="font-semibold text-brand-black text-sm mb-1">{cat.name}</span>
              <span className="text-xs text-brand-gray leading-tight">{cat.description}</span>
              <span className="mt-3 text-brand-red opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
