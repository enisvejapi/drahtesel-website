'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Bike, MapPin, Tag, Map } from 'lucide-react'
import { useLocale } from '@/components/LocaleProvider'
import clsx from 'clsx'

export default function BottomNav() {
  const pathname = usePathname()
  const { locale } = useLocale()

  if (pathname.startsWith('/tours')) return null
  const de = locale === 'de'

  const items = [
    { href: '/', icon: Home, label: de ? 'Start' : 'Home' },
    { href: '/bikes', icon: Bike, label: de ? 'Mieten' : 'Rent' },
    { href: '/locations', icon: MapPin, label: de ? 'Standort' : 'Location' },
    { href: '/pricing', icon: Tag, label: de ? 'Shop' : 'Shop' },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex items-end justify-around px-2 pt-2 pb-3">

        {/* First 2 items */}
        {items.slice(0, 2).map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link key={href} href={href}
              className={clsx(
                'flex flex-col items-center gap-0.5 min-w-[52px] py-1 px-2 rounded-xl transition-colors',
                active ? 'text-brand-red' : 'text-gray-400 hover:text-gray-700'
              )}>
              <Icon size={22} strokeWidth={active ? 2.2 : 1.8} />
              <span className={clsx('text-[10px] font-semibold', active ? 'text-brand-red' : 'text-gray-400')}>{label}</span>
              {active && <span className="w-1 h-1 rounded-full bg-brand-red mt-0.5" />}
            </Link>
          )
        })}

        {/* Center Tours button */}
        <Link href="/tours"
          className="flex flex-col items-center gap-1 -mt-5">
          <span className={clsx(
            'w-14 h-14 rounded-2xl shadow-lg flex items-center justify-center transition-all',
            pathname.startsWith('/tours')
              ? 'bg-brand-red shadow-brand-red/40 scale-110'
              : 'bg-brand-red shadow-brand-red/30'
          )}>
            <Map size={24} className="text-white" strokeWidth={2} />
          </span>
          <span className="text-[10px] font-bold text-brand-red">{de ? 'Touren' : 'Tours'}</span>
        </Link>

        {/* Last 2 items */}
        {items.slice(2).map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link key={href} href={href}
              className={clsx(
                'flex flex-col items-center gap-0.5 min-w-[52px] py-1 px-2 rounded-xl transition-colors',
                active ? 'text-brand-red' : 'text-gray-400 hover:text-gray-700'
              )}>
              <Icon size={22} strokeWidth={active ? 2.2 : 1.8} />
              <span className={clsx('text-[10px] font-semibold', active ? 'text-brand-red' : 'text-gray-400')}>{label}</span>
              {active && <span className="w-1 h-1 rounded-full bg-brand-red mt-0.5" />}
            </Link>
          )
        })}

      </div>
    </nav>
  )
}
