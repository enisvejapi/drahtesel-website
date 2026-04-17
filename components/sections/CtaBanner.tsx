'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useLocale } from '@/components/LocaleProvider'

export default function CtaBanner() {
  const { t } = useLocale()

  return (
    <section className="bg-brand-black py-16 md:py-20">
      <div className="container-site text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
          {t('cta.title')}
        </h2>
        <p className="text-lg text-gray-400 mb-8 max-w-md mx-auto">
          {t('cta.subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/bikes" className="btn-primary text-base px-10 py-4">
            {t('cta.browseAll')} <ArrowRight size={18} />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white font-medium transition-colors"
          >
            {t('cta.contact')}
          </Link>
        </div>
      </div>
    </section>
  )
}
