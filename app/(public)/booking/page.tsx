import Link from 'next/link'
import { Shield, RotateCcw, Lock, Phone, ArrowRight } from 'lucide-react'

export default function BookingPage() {
  return (
    <div className="pt-20 min-h-screen bg-white">
      <div className="container-site py-16 max-w-2xl">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-10">
          {['Your Selection', 'Secure Payment', 'Confirmation'].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 ${i === 1 ? 'text-brand-red font-semibold' : i < 1 ? 'text-green-600 font-medium' : 'text-brand-gray'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  i === 1 ? 'bg-brand-red text-white' : i < 1 ? 'bg-green-500 text-white' : 'bg-gray-200 text-brand-gray'
                }`}>
                  {i + 1}
                </div>
                <span className="text-xs hidden sm:block">{step}</span>
              </div>
              {i < 2 && <div className="w-8 h-px bg-gray-300 flex-shrink-0" />}
            </div>
          ))}
        </div>

        <div className="card p-8 mb-6">
          <h1 className="text-2xl font-bold text-brand-black mb-2">Complete Your Booking</h1>
          <p className="text-brand-gray text-sm mb-8">
            You are about to be redirected to our secure booking partner, Mietrad, to complete your payment. Your bike selection is saved.
          </p>

          {/* Trust elements */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { icon: <Shield size={18} className="text-green-600" />, title: 'SSL Encrypted', sub: 'Secure checkout' },
              { icon: <Lock size={18} className="text-blue-600" />, title: 'Powered by Mietrad', sub: 'Trusted booking partner' },
              { icon: <RotateCcw size={18} className="text-brand-red" />, title: 'Free Cancellation', sub: 'Up to 24h before' },
            ].map((t) => (
              <div key={t.title} className="flex items-center gap-3 p-3 bg-brand-muted rounded-xl">
                {t.icon}
                <div>
                  <div className="text-xs font-semibold text-brand-black">{t.title}</div>
                  <div className="text-xs text-brand-gray">{t.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <Link href="/bikes" className="btn-primary w-full py-4 text-base mb-4">
            Proceed to Secure Checkout <ArrowRight size={18} />
          </Link>

          <p className="text-xs text-brand-gray text-center">
            You will be redirected to Mietrad. A new tab will open so your Drahtesel selection remains open.
          </p>
        </div>

        <div className="text-center">
          <a href="tel:+49000000000" className="inline-flex items-center gap-2 text-sm text-brand-gray hover:text-brand-black transition-colors">
            <Phone size={14} />
            Prefer to book by phone? Call us: +49 000 000 0000
          </a>
        </div>
      </div>
    </div>
  )
}
