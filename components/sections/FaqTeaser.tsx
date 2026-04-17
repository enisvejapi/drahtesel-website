'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useLocale } from '@/components/LocaleProvider'

type Faq = { id?: string; question: string; answer: string }

export default function FaqTeaser({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<number | null>(null)
  const { t } = useLocale()
  const topFaqs = faqs.slice(0, 4)

  return (
    <section className="section-pad bg-white">
      <div className="container-site">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">{t('faq.title')}</h2>
            <p className="section-subtitle mx-auto">
              {t('faq.subtitle')}
            </p>
          </div>

          <div className="flex flex-col gap-3 mb-8">
            {topFaqs.map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between gap-4 p-5 text-left bg-white hover:bg-brand-muted transition-colors"
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span className="font-semibold text-brand-black">{faq.question}</span>
                  {open === i
                    ? <ChevronUp size={18} className="flex-shrink-0 text-brand-red" />
                    : <ChevronDown size={18} className="flex-shrink-0 text-brand-gray" />
                  }
                </button>
                {open === i && (
                  <div className="px-5 pb-5 text-sm text-brand-gray leading-relaxed border-t border-gray-100 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/how-it-works#faq" className="btn-ghost">
              {t('faq.seeAll')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
