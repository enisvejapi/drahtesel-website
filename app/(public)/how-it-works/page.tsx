import { readFaqs } from '@/lib/data-server'
import HowItWorksClient from './HowItWorksClient'

export const dynamic = 'force-dynamic'

export default async function HowItWorksPage() {
  const faqs = await readFaqs()
  return <HowItWorksClient faqs={faqs} />
}
