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
  const [scrolled,        setScrolled]        = useState(false)
  const [heroBrightness,  setHeroBrightness]  = useState(0) // 0=dark, 255=bright
  const { t }    = useLocale()
  const pathname = usePathname()

  const isHomePage    = pathname === '/'
  const isGlassPage   = pathname === '/pricing' // stays frosted glass while scrolling, never solid white

  useEffect(() => {
    if (isGlassPage) {
      setScrolled(false) // never turns white
      return
    }
    if (!isHomePage) {
      setScrolled(true)
      return
    }
    setScrolled(false)
    const hero = document.getElementById('hero-section')
    if (!hero) return
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0, rootMargin: '30% 0px 0px 0px' }
    )
    observer.observe(hero)
    return () => observer.disconnect()
  }, [pathname, isHomePage, isGlassPage])

  // Listen for brightness updates from the hero slideshow
  useEffect(() => {
    const handler = (e: Event) => setHeroBrightness((e as CustomEvent<number>).detail)
    window.addEventListener('hero-brightness', handler)
    return () => window.removeEventListener('hero-brightness', handler)
  }, [])

  // If hero image top is bright → use dark text, else white
  const heroIsLight = isHomePage && !scrolled && heroBrightness > 140

  if (pathname.startsWith('/tours')) return null

  const isDarkPage = false // removed — handled by isDarkHero above

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
        'sticky top-0 md:fixed md:left-0 md:right-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md'
          : isGlassPage
            ? 'bg-white/10 backdrop-blur-md border-b border-white/10'
            : 'bg-black/80 md:bg-black/20 backdrop-blur-md'
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
              scrolled && !isDarkPage ? 'text-brand-black' : 'text-white'
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
                  scrolled && !isDarkPage
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
                scrolled && !isDarkPage
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
            <LanguageSwitcher light={!scrolled || isDarkPage} />
          </div>

        </div>
      </div>
    </header>
  )
}
