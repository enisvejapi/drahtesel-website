'use client'

import { Wrench, MapPin, HeadphonesIcon, ShieldCheck, Star, Clock } from 'lucide-react'
import { useLocale } from '@/components/LocaleProvider'

export default function WhyUs() {
  const { t } = useLocale()

  const features = [
    {
      icon: <Wrench size={24} />,
      title: t('whyUs.feat1Title'),
      description: t('whyUs.feat1Desc'),
    },
    {
      icon: <MapPin size={24} />,
      title: t('whyUs.feat2Title'),
      description: t('whyUs.feat2Desc'),
    },
    {
      icon: <HeadphonesIcon size={24} />,
      title: t('whyUs.feat3Title'),
      description: t('whyUs.feat3Desc'),
    },
    {
      icon: <ShieldCheck size={24} />,
      title: t('whyUs.feat4Title'),
      description: t('whyUs.feat4Desc'),
    },
    {
      icon: <Star size={24} />,
      title: t('whyUs.feat5Title'),
      description: t('whyUs.feat5Desc'),
    },
    {
      icon: <Clock size={24} />,
      title: t('whyUs.feat6Title'),
      description: t('whyUs.feat6Desc'),
    },
  ]

  return (
    <section className="section-pad bg-white">
      <div className="container-site">
        <div className="text-center mb-14">
          <h2 className="section-title">{t('whyUs.title')}</h2>
          <p className="section-subtitle mx-auto">
            {t('whyUs.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="flex gap-4 p-6 rounded-xl hover:bg-brand-muted transition-colors">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-bold text-brand-black mb-1.5">{feature.title}</h3>
                <p className="text-sm text-brand-gray leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
