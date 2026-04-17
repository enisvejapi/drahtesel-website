import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Drahtesel — Bike Rental',
  description: 'Rent a bike easily. City bikes, e-bikes, mountain bikes and more. Simple online booking, local pickup.',
  keywords: 'bike rental, fahrrad leihen, e-bike rental, city bike, Drahtesel',
  openGraph: {
    title: 'Drahtesel — Bike Rental',
    description: 'Rent a bike easily. City bikes, e-bikes, mountain bikes and more.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  )
}
