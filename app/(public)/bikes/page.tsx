import MietradWidget from './MietradWidget'
import ForceFullNavigation from './ForceFullNavigation'

export default function BikesPage() {
  return (
    <div className="pt-20 min-h-screen bg-white">

      {/* Same header template as before */}
      <div className="bg-brand-muted border-b border-gray-200">
        <div className="container-site py-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-brand-black mb-2">
            Unsere Fahrräder
          </h1>
          <p className="text-brand-gray">
            Wähle dein Fahrrad, buche direkt online — sicher über Mietrad.de.
          </p>
        </div>
      </div>

      <div className="container-site py-10">
        <MietradWidget />
      </div>

      <ForceFullNavigation />
    </div>
  )
}
