import AdminSidebar from '@/components/admin/AdminSidebar'
import { LocaleProvider } from '@/components/LocaleProvider'
import { getLocale } from '@/lib/locale'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  const messages = locale === 'en'
    ? (await import('@/messages/en.json')).default
    : (await import('@/messages/de.json')).default

  return (
    <LocaleProvider locale={locale} messages={messages}>
      <div className="min-h-screen bg-gray-50 flex">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </LocaleProvider>
  )
}
