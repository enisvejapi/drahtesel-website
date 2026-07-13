import PricingClient from './PricingClient'
import { readShopBikes, readShopStatus } from '@/lib/data-server'
import Image from 'next/image'

export default async function PricingPage() {
  const [bikes, shopActive] = await Promise.all([readShopBikes(), readShopStatus()])

  return (
    <div className="relative">
      {/* Page content — always rendered */}
      <div className={shopActive ? '' : 'blur-[1px] pointer-events-none select-none'}>
        <PricingClient initialBikes={bikes} />
      </div>

      {/* Coming Soon overlay — only when shop is inactive */}
      {!shopActive && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/50 px-6">
          <div className="flex flex-col items-center text-center max-w-sm">
            {/* Logo */}
            <div className="w-20 h-20 relative mb-6">
              <Image src="/logo.jpg" alt="Drahtesel" fill className="object-contain rounded-2xl shadow-2xl" />
            </div>

            {/* Badge */}
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-4">
              Drahtesel Norderney
            </span>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-3">
              Unser Online-Shop<br />
              <span className="text-brand-red">kommt bald.</span>
            </h1>

            {/* Subtext */}
            <p className="text-white/50 text-sm leading-relaxed">
              Wir arbeiten daran, dir das beste Erlebnis zu bieten.<br />
              Bis dahin kannst du uns direkt kontaktieren.
            </p>

            {/* Divider */}
            <div className="w-12 h-px bg-white/20 my-6" />

            {/* Contact link */}
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-red-dark text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors"
            >
              Kontakt aufnehmen
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
