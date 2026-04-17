import { cookies } from 'next/headers'

export type Locale = 'de' | 'en'
export const DEFAULT_LOCALE: Locale = 'de'
export const LOCALES: Locale[] = ['de', 'en']

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  const locale = cookieStore.get('locale')?.value
  return (locale === 'en' ? 'en' : 'de') as Locale
}
