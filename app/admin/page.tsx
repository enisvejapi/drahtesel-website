import { readReviews, readFaqs } from '@/lib/data-server'
import { Star, HelpCircle, ExternalLink, MessageSquare, Settings, MapPin, KeyRound, Route } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
  const reviews = readReviews()
  const faqs = readFaqs()

  const stats = [
    { label: 'Bewertungen', value: reviews.length, icon: Star, color: 'bg-yellow-500', href: '/admin/reviews' },
    { label: 'FAQs', value: faqs.length, icon: HelpCircle, color: 'bg-purple-500', href: '/admin/faqs' },
    { label: 'Entdeckungs-Pins', value: 'Verwalten', icon: MapPin, color: 'bg-brand-red', href: '/admin/pins' },
  ]

  const recentReviews = reviews.slice(0, 5)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Drahtesel Norderney — Admin</p>
        </div>
        <Link href="/" target="_blank" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
          <ExternalLink size={14} />
          Live-Website
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-2 rounded-lg`}>
                <stat.icon size={18} className="text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Buchungssystem */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-3">Buchungssystem</h2>
          <div className="p-4 bg-green-50 rounded-xl border border-green-200 mb-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm text-green-700 font-semibold">Mietrad.de Widget aktiv</span>
            </div>
            <p className="text-xs text-green-600">
              Fahrräder, Preise und Buchungen werden automatisch von Mietrad.de geladen.
              Kein manuelles Pflegen notwendig.
            </p>
          </div>
          <Link href="/bikes" target="_blank"
            className="flex items-center gap-2 text-sm text-brand-red hover:text-brand-red-dark font-medium transition-colors">
            <ExternalLink size={14} /> Buchungsseite ansehen →
          </Link>
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-3">Schnellzugriff</h2>
          <div className="flex flex-col gap-1">
            {[
              { href: '/admin/pins', label: 'Entdeckungs-Pins verwalten', icon: MapPin },
              { href: '/admin/weekly-pins', label: 'Wochen-PINs & Download', icon: KeyRound },
              { href: '/admin/predefined-routes', label: 'Touren-Vorschläge verwalten', icon: Route },
              { href: '/admin/reviews', label: 'Bewertungen verwalten', icon: MessageSquare },
              { href: '/admin/faqs', label: 'FAQs bearbeiten', icon: HelpCircle },
              { href: '/admin/settings', label: 'Passwort ändern', icon: Settings },
            ].map((action) => (
              <Link key={action.label} href={action.href}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700">
                <action.icon size={16} className="text-brand-red" />
                {action.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Recent reviews */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Neueste Bewertungen</h2>
            <Link href="/admin/reviews" className="text-xs text-brand-red hover:text-brand-red-dark transition-colors">
              Alle anzeigen →
            </Link>
          </div>
          {recentReviews.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">Noch keine Bewertungen</p>
          ) : (
            <div className="flex flex-col gap-3">
              {recentReviews.map((review) => (
                <div key={review.id} className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
                  <div className="w-8 h-8 rounded-full bg-brand-muted flex items-center justify-center flex-shrink-0 text-sm font-bold text-brand-red">
                    {review.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">{review.name}</span>
                      <span className="text-yellow-400 text-xs">{'★'.repeat(review.rating)}</span>
                      <span className="text-xs text-gray-400">{review.date}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{review.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
