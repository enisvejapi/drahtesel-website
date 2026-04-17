'use client'

import Link from 'next/link'
import { Search, CalendarDays, CreditCard, Bike } from 'lucide-react'
import { useLocale } from '@/components/LocaleProvider'

export default function HowItWorks() {
  const { t } = useLocale()

  const steps = [
    {
      icon: <Search size={28} />,
      step: '01',
      title: t('howItWorks.step1Title'),
      description: t('howItWorks.step1Desc'),
    },
    {
      icon: <CalendarDays size={28} />,
      step: '02',
      title: t('howItWorks.step2Title'),
      description: t('howItWorks.step2Desc'),
    },
    {
      icon: <CreditCard size={28} />,
      step: '03',
      title: t('howItWorks.step3Title'),
      description: t('howItWorks.step3Desc'),
    },
    {
      icon: <Bike size={28} />,
      step: '04',
      title: t('howItWorks.step4Title'),
      description: t('howItWorks.step4Desc'),
    },
  ]

  return (
    <section className="section-pad bg-white">
      <div className="container-site">
        <div className="text-center mb-14">
          <h2 className="section-title">{t('howItWorks.title')}</h2>
          <p className="section-subtitle mx-auto">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((step, i) => (
            <div key={step.step} className="relative flex flex-col items-center text-center p-6">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[calc(50%+44px)] right-0 h-px bg-gray-200" />
              )}
              <div className="w-16 h-16 rounded-2xl bg-brand-red/10 text-brand-red flex items-center justify-center mb-4 relative z-10">
                {step.icon}
              </div>
              <div className="text-xs font-bold text-brand-red uppercase tracking-widest mb-2">{step.step}</div>
              <h3 className="font-bold text-lg text-brand-black mb-2">{step.title}</h3>
              <p className="text-sm text-brand-gray leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/bikes" className="btn-primary px-10 py-4">
            {t('howItWorks.startBooking')}
          </Link>
        </div>
      </div>
    </section>
  )
}
