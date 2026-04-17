'use client'

import { Star, ExternalLink } from 'lucide-react'
import { useLocale } from '@/components/LocaleProvider'

type Review = { id?: string; name: string; date: string; rating: number; text: string; source: string }

export default function Reviews({ reviews }: { reviews: Review[] }) {
  const { t } = useLocale()

  return (
    <section className="section-pad bg-brand-muted">
      <div className="container-site">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            {[1,2,3,4,5].map((i) => (
              <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <h2 className="section-title">{t('reviews.title')}</h2>
          <p className="section-subtitle mx-auto">
            {t('reviews.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {reviews.map((review) => (
            <div key={review.name} className="card p-6">
              <div className="flex items-center gap-1 mb-4">
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} size={14} className={i <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'} />
                ))}
              </div>
              <p className="text-brand-gray text-sm leading-relaxed mb-5 italic">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm text-brand-black">{review.name}</div>
                  <div className="text-xs text-brand-gray">{review.date}</div>
                </div>
                <div className="flex items-center gap-1 text-xs text-brand-gray">
                  <span className="text-[10px] font-bold text-[#4285F4]">G</span>
                  Google
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-brand-gray hover:text-brand-black font-medium text-sm transition-colors"
          >
            {t('reviews.seeAll')} <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </section>
  )
}
