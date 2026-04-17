'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin, Instagram, Facebook } from 'lucide-react'
import { useLocale } from '@/components/LocaleProvider'
import { usePathname } from 'next/navigation'

export default function Footer() {
  const { t } = useLocale()
  const pathname = usePathname()

  if (pathname.startsWith('/tours')) return null

  const footerLinks = {
    [t('footer.bikes')]: [
      { label: t('footer.cityBikes'), href: '/bikes?category=city-bike' },
      { label: t('footer.eBikes'), href: '/bikes?category=e-bike' },
      { label: t('footer.kinder'), href: '/bikes?category=kinderrad' },
      { label: t('footer.anhaenger'), href: '/bikes?category=anhaenger' },
      { label: t('footer.eLastenrad'), href: '/bikes?category=e-lastenrad' },
      { label: t('footer.eMobil'), href: '/bikes?category=e-mobil' },
    ],
    [t('footer.information')]: [
      { label: t('footer.howItWorks'), href: '/how-it-works' },
      { label: t('footer.pricing'), href: '/pricing' },
      { label: t('footer.locations'), href: '/locations' },
      { label: t('footer.faq'), href: '/how-it-works#faq' },
      { label: t('footer.about'), href: '/about' },
      { label: t('footer.contact'), href: '/contact' },
    ],
    [t('footer.legal')]: [
      { label: t('footer.privacy'), href: '/privacy' },
      { label: t('footer.terms'), href: '/terms' },
      { label: t('footer.imprint'), href: '/imprint' },
    ],
  }

  return (
    <footer className="bg-brand-black text-white">
      <div className="container-site py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 relative">
                <Image src="/logo.jpg" alt="Drahtesel" fill className="object-contain rounded" />
              </div>
              <span className="text-xl font-bold tracking-tight">Drahtesel</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              {t('footer.tagline')}
            </p>
            <div className="flex flex-col gap-3 text-sm text-gray-400">
              <a href="tel:+4949324980397" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone size={15} /> +49 4932 4980397
              </a>
              <a href="mailto:info@drahtesel-norderney.de" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail size={15} /> info@drahtesel-norderney.de
              </a>
              <span className="flex items-center gap-2">
                <MapPin size={15} /> Herrenpfad 21-22, 26548 Norderney
              </span>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <a href="#" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-brand-red flex items-center justify-center transition-colors">
                <Instagram size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-brand-red flex items-center justify-center transition-colors">
                <Facebook size={16} />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-4">{title}</h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
          <span>© {new Date().getFullYear()} Drahtesel. {t('footer.rights')}</span>
          <span>{t('footer.poweredBy')}</span>
        </div>
      </div>
    </footer>
  )
}
