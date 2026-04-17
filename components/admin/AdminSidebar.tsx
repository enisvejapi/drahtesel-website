'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import clsx from 'clsx'
import {
  LayoutDashboard, Star, HelpCircle,
  Settings, LogOut, ChevronLeft, ChevronRight, Menu, AlertTriangle, MapPin, KeyRound, Route
} from 'lucide-react'
import { useLocale } from '@/components/LocaleProvider'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const { t } = useLocale()

  const navItems = [
    { href: '/admin', label: t('admin.dashboard'), icon: LayoutDashboard, exact: true },
    { href: '/admin/reports', label: 'Meldungen', icon: AlertTriangle },
    { href: '/admin/pins', label: 'Entdeckungs-Pins', icon: MapPin },
    { href: '/admin/weekly-pins', label: 'Wochen-PINs', icon: KeyRound },
    { href: '/admin/predefined-routes', label: 'Touren-Vorschläge', icon: Route },
    { href: '/admin/reviews', label: t('admin.reviews'), icon: Star },
    { href: '/admin/faqs', label: t('admin.faqs'), icon: HelpCircle },
    { href: '/admin/settings', label: t('admin.settings'), icon: Settings },
  ]

  const isActive = (item: typeof navItems[0]) => {
    if (item.exact) return pathname === item.href
    return pathname.startsWith(item.href)
  }

  async function handleLogout() {
    await fetch('/api/admin/auth/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside className={clsx(
      'bg-[#111111] text-white flex flex-col transition-all duration-300 min-h-screen flex-shrink-0',
      collapsed ? 'w-16' : 'w-60'
    )}>
      {/* Header */}
      <div className={clsx('flex items-center h-16 px-3 border-b border-white/10', collapsed ? 'justify-center' : 'justify-between gap-2')}>
        {!collapsed && (
          <Link href="/admin" className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 flex-shrink-0 relative">
              <Image src="/logo.jpg" alt="Drahtesel" fill className="object-contain rounded" />
            </div>
            <span className="font-bold text-sm truncate">Drahtesel Admin</span>
          </Link>
        )}
        {collapsed && (
          <div className="w-8 h-8 relative flex-shrink-0">
            <Image src="/logo.jpg" alt="Drahtesel" fill className="object-contain rounded" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex-shrink-0 p-1 rounded hover:bg-white/10 transition-colors"
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 flex flex-col gap-0.5">
        {navItems.map((item) => {
          const active = isActive(item)
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={clsx(
                'flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                active
                  ? 'bg-brand-red text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/10',
                collapsed && 'justify-center px-0'
              )}
            >
              <item.icon size={18} className="flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-white/10">
        {!collapsed && (
          <div className="px-2.5 py-2 mb-1">
            <LanguageSwitcher className="text-gray-400" />
          </div>
        )}
        <Link
          href="/"
          target="_blank"
          title={collapsed ? 'View site' : undefined}
          className={clsx(
            'flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-colors mb-1',
            collapsed && 'justify-center px-0'
          )}
        >
          <Menu size={18} className="flex-shrink-0" />
          {!collapsed && <span>View Site</span>}
        </Link>
        <button
          onClick={handleLogout}
          title={collapsed ? t('admin.logout') : undefined}
          className={clsx(
            'w-full flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-white/10 transition-colors',
            collapsed && 'justify-center px-0'
          )}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span>{t('admin.logout')}</span>}
        </button>
      </div>
    </aside>
  )
}
