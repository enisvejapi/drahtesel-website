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
      <head>
        {/* PWA — runs fullscreen when added to home screen */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Drahtesel" />
        <meta name="theme-color" content="#C8102E" />
        {/* Viewport: cover safe areas */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body>{children}</body>
    </html>
  )
}
