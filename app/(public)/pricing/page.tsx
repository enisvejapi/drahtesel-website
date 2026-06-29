import PricingClient from './PricingClient'
import { readShopBikes } from '@/lib/data-server'

export default async function PricingPage() {
  const bikes = await readShopBikes()
  return <PricingClient initialBikes={bikes} />
}
