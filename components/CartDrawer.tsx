'use client'

import { X, ShoppingCart, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useLocale } from '@/components/LocaleProvider'

interface Props {
  open: boolean
  onClose: () => void
}

export default function CartDrawer({ open, onClose }: Props) {
  const { locale } = useLocale()
  const de = locale === 'de'

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm" onClick={onClose} />
      )}
      <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-[70] shadow-2xl flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingCart size={18} className="text-brand-red" />
            <span className="font-bold text-brand-black">{de ? 'Buchung' : 'Booking'}</span>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 px-5">
          <ShoppingCart size={40} className="text-gray-200" />
          <div>
            <div className="font-bold text-brand-black mb-1">
              {de ? 'Jetzt direkt buchen' : 'Book directly now'}
            </div>
            <div className="text-sm text-brand-gray">
              {de
                ? 'Wähle dein Fahrrad, Datum und Uhrzeit direkt auf unserer Buchungsseite.'
                : 'Choose your bike, date and time directly on our booking page.'}
            </div>
          </div>
          <Link href="/bikes" onClick={onClose} className="btn-primary px-6 py-3 text-sm flex items-center gap-2">
            {de ? 'Zur Buchungsseite' : 'Go to Booking'}
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </>
  )
}
