import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import BottomNav from '@/components/layout/BottomNav'
import { LocaleProvider } from '@/components/LocaleProvider'
import { CartProvider } from '@/lib/cart-context'
import { getLocale } from '@/lib/locale'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  const messages = locale === 'en'
    ? (await import('@/messages/en.json')).default
    : (await import('@/messages/de.json')).default

  return (
    <LocaleProvider locale={locale} messages={messages}>
      <CartProvider>
        <Navbar />
        <main className="pb-24 md:pb-0">{children}</main>
        <Footer />
        <BottomNav />
      </CartProvider>
    </LocaleProvider>
  )
}
