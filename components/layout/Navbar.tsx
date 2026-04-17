'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Phone } from 'lucide-react'
import clsx from 'clsx'
import { useLocale } from '@/components/LocaleProvider'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { t } = useLocale()
  const pathname = usePathname()

  useEffect(() => {
    const hero = document.querySelector('section')
    if (!hero) return
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  if (pathname.startsWith('/tours')) return null

  const navLinks = [
    { label: t('nav.bikes'), href: '/bikes' },
    { label: t('nav.tours'), href: '/tours' },
    { label: t('nav.locations'), href: '/locations' },
    { label: t('nav.pricing'), href: '/pricing' },
    { label: t('nav.howItWorks'), href: '/how-it-works' },
    { label: t('nav.about'), href: '/about' },
  ]

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md'
          : 'bg-black/20 backdrop-blur-md'
      )}
    >
      <div className="container-site">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 md:w-12 md:h-12 relative">
              <Image
                src="/logo.jpg"
                alt="Drahtesel Logo"
                fill
                className="object-contain rounded"
                priority
              />
            </div>
            <span className={clsx(
              'font-bold tracking-tight transition-colors duration-500 flex items-baseline gap-1',
              scrolled ? 'text-brand-black' : 'text-white'
            )}>
              <span className="text-xl md:text-2xl">Drahtesel</span>
              <span className="text-[13px] md:text-[15px] font-semibold opacity-70">- Norderney</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  'font-medium transition-colors duration-300 text-sm',
                  scrolled
                    ? 'text-brand-gray hover:text-brand-black'
                    : 'text-white/90 hover:text-white'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            <a
              href="tel:+4949324980397"
              className={clsx(
                'flex items-center gap-1.5 text-sm transition-colors duration-300',
                scrolled
                  ? 'text-brand-gray hover:text-brand-black'
                  : 'text-white/90 hover:text-white'
              )}
            >
              <Phone size={15} />
              <span className="font-medium">{t('nav.callUs')}</span>
            </a>
            <Link href="/bikes" className="btn-primary">
              {t('nav.bookBike')}
            </Link>
          </div>

          {/* Mobile: language switcher */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageSwitcher light={!scrolled} />
          </div>

        </div>
      </div>
    </header>
  )
}
