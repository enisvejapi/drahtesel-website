export default function AGBPage() {
  return (
    <div className="pt-20 min-h-screen bg-white">
      <div className="bg-brand-muted border-b border-gray-200">
        <div className="container-site py-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-brand-black mb-2">Allgemeine Geschäftsbedingungen</h1>
          <p className="text-brand-gray">Drahtesel Fahrradverleih Norderney — Stand: Januar 2025</p>
        </div>
      </div>

      <div className="container-site py-12 pb-20 max-w-3xl">
        <div className="space-y-8 text-brand-gray leading-relaxed text-sm">

          <section>
            <h2 className="text-lg font-bold text-brand-black mb-3">§ 1 Geltungsbereich</h2>
            <p>
              Diese Allgemeinen Geschäftsbedingungen gelten für alle Mietverträge zwischen dem Drahtesel Fahrradverleih, Herrenpfad 21–22, 26548 Norderney (nachfolgend „Vermieter") und dem Mieter. Abweichende Bedingungen des Mieters werden nicht anerkannt, sofern der Vermieter diesen nicht ausdrücklich schriftlich zugestimmt hat.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-black mb-3">§ 2 Vertragsschluss</h2>
            <p>
              Der Mietvertrag kommt durch die Buchungsbestätigung des Vermieters — per E-Mail oder direkt bei der Abholung — zustande. Online-Buchungen über die Plattform Mietrad.de gelten als verbindlich, sobald der Mieter die Bestätigungs-E-Mail erhalten hat.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-black mb-3">§ 3 Mietgegenstand und Übergabe</h2>
            <p>
              Der Vermieter stellt dem Mieter das gebuchte Fahrrad sowie Helm und Schloss zur Verfügung. Das Fahrrad wird in verkehrssicherem Zustand übergeben. Der Mieter ist verpflichtet, das Fahrrad bei Übernahme auf offensichtliche Mängel zu prüfen und diese sofort zu melden. Spätere Mängelanzeigen werden nicht berücksichtigt.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-black mb-3">§ 4 Mietdauer und Rückgabe</h2>
            <p>
              Die Mietdauer ergibt sich aus der Buchung. Das Fahrrad ist zum vereinbarten Zeitpunkt gereinigt und unbeschädigt zurückzugeben. Bei verspäteter Rückgabe ohne vorherige Absprache wird eine zusätzliche Tagesgebühr berechnet. Eine Verlängerung der Mietdauer ist nur nach Absprache und Verfügbarkeit möglich.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-black mb-3">§ 5 Mietpreis und Zahlung</h2>
            <p>
              Der Mietpreis ergibt sich aus der aktuellen Preisliste des Vermieters. Die Zahlung erfolgt bei Abholung in bar oder per Kartenzahlung, bei Online-Buchungen über die Plattform Mietrad.de gemäß deren Zahlungsbedingungen. Alle Preise verstehen sich inkl. der gesetzlichen Mehrwertsteuer.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-black mb-3">§ 6 Stornierung</h2>
            <p>
              Stornierungen sind bis 24 Stunden vor dem vereinbarten Abholtermin kostenlos möglich. Bei Stornierungen innerhalb von 24 Stunden vor Mietbeginn oder bei Nichterscheinen wird der volle Mietpreis in Rechnung gestellt. Online-Buchungen können direkt über die Mietrad.de-Plattform storniert werden.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-black mb-3">§ 7 Pflichten des Mieters</h2>
            <p>Der Mieter verpflichtet sich:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Das Fahrrad pfleglich zu behandeln und ausschließlich im Straßenverkehr zu nutzen</li>
              <li>Das Fahrrad nicht an Dritte weiterzugeben oder unterzuvermieten</li>
              <li>Das Fahrrad bei Nichtbenutzung zu sichern (Schloss nutzen)</li>
              <li>Schäden und Unfälle sofort dem Vermieter zu melden</li>
              <li>Verkehrsregeln zu beachten und einen Helm zu tragen</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-black mb-3">§ 8 Haftung des Mieters</h2>
            <p>
              Der Mieter haftet für alle Schäden am Mietfahrrad, die während der Mietzeit entstehen und von ihm oder Dritten verursacht wurden, sowie für den Verlust oder Diebstahl des Fahrrads. Im Falle eines Diebstahls hat der Mieter unverzüglich Anzeige bei der Polizei zu erstatten und dem Vermieter eine Kopie zu übergeben.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-black mb-3">§ 9 Haftung des Vermieters</h2>
            <p>
              Der Vermieter haftet nicht für Unfälle oder Schäden, die durch unsachgemäße Nutzung des Fahrrads entstehen. Eine Haftung für entgangene Nutzung bei technischen Defekten, die nicht auf Verschulden des Vermieters zurückzuführen sind, ist ausgeschlossen. Die gesetzliche Haftung bei Vorsatz und grober Fahrlässigkeit bleibt unberührt.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-black mb-3">§ 10 Datenschutz</h2>
            <p>
              Die Erhebung und Verarbeitung personenbezogener Daten erfolgt ausschließlich zur Abwicklung des Mietverhältnisses und im Einklang mit der geltenden Datenschutz-Grundverordnung (DSGVO). Weitere Informationen entnehmen Sie bitte unserer{' '}
              <a href="/datenschutz" className="text-brand-red hover:underline">Datenschutzerklärung</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-black mb-3">§ 11 Schlussbestimmungen</h2>
            <p>
              Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand für alle Streitigkeiten aus diesem Vertrag ist, soweit gesetzlich zulässig, Norderney. Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.
            </p>
          </section>

          <p className="text-xs text-brand-gray pt-4 border-t border-gray-200">
            Drahtesel Fahrradverleih · Herrenpfad 21–22 · 26548 Norderney · info@drahtesel-norderney.de
          </p>
        </div>
      </div>
    </div>
  )
}
