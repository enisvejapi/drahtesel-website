'use client'

import { Star, Shield, RotateCcw, Users, Bike } from 'lucide-react'
import { useLocale } from '@/components/LocaleProvider'

export default function TrustBar() {
  const { t } = useLocale()

  const items = [
    { icon: <Star size={18} className="text-yellow-500 fill-yellow-500" />, label: t('trustBar.rating'), sub: t('trustBar.ratingSub') },
    { icon: <Shield size={18} className="text-green-600" />, label: t('trustBar.secure'), sub: t('trustBar.secureSub') },
    { icon: <RotateCcw size={18} className="text-blue-600" />, label: t('trustBar.cancel'), sub: t('trustBar.cancelSub') },
    { icon: <Users size={18} className="text-brand-red" />, label: t('trustBar.local'), sub: t('trustBar.localSub') },
    { icon: <Bike size={18} className="text-brand-black" />, label: t('trustBar.bikes'), sub: t('trustBar.bikesSub') },
  ]

  return (
    <section className="bg-white border-y border-gray-100 shadow-sm">
      <div className="container-site py-5">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 md:justify-between">
          {items.map((item) => (
            <div key={item.label} className="flex items-center gap-2.5">
              <div className="flex-shrink-0">{item.icon}</div>
              <div>
                <div className="text-sm font-semibold text-brand-black leading-tight">{item.label}</div>
                <div className="text-xs text-brand-gray">{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
