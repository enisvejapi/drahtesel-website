export default function DatenschutzPage() {
  return (
    <div className="pt-20 min-h-screen bg-white">
      <div className="bg-brand-muted border-b border-gray-200">
        <div className="container-site py-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-brand-black mb-2">Datenschutzerklärung</h1>
          <p className="text-brand-gray">Gemäß DSGVO und BDSG — Stand: Januar 2025</p>
        </div>
      </div>

      <div className="container-site py-12 pb-20 max-w-3xl">
        <div className="space-y-8 text-brand-gray leading-relaxed text-sm">

          <section>
            <h2 className="text-lg font-bold text-brand-black mb-3">1. Verantwortlicher</h2>
            <p>
              Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:<br /><br />
              Eleandro Pema<br />
              Drahtesel Fahrradverleih<br />
              Herrenpfad 21–22<br />
              26548 Norderney<br /><br />
              Telefon: <a href="tel:+4949324980397" className="text-brand-red hover:underline">+49 4932 4980397</a><br />
              E-Mail: <a href="mailto:info@drahtesel-norderney.de" className="text-brand-red hover:underline">info@drahtesel-norderney.de</a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-black mb-3">2. Erhebung und Speicherung personenbezogener Daten</h2>
            <p>
              Beim Besuch unserer Website werden automatisch Informationen allgemeiner Natur erfasst. Diese Informationen (Server-Logfiles) beinhalten etwa die Art des Webbrowsers, das verwendete Betriebssystem, den Domainnamen Ihres Internet-Service-Providers, Ihre IP-Adresse und Ähnliches. Diese Daten sind nicht bestimmten Personen zuzuordnen und werden nicht mit anderen Daten zusammengeführt. Sie werden ausschließlich für statistische Auswertungen genutzt.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-black mb-3">3. Daten bei Buchungen</h2>
            <p>
              Wenn Sie eine Buchung über unsere Website oder die Plattform Mietrad.de vornehmen, erheben wir folgende Daten:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Vor- und Nachname</li>
              <li>E-Mail-Adresse</li>
              <li>Telefonnummer</li>
              <li>Zahlungsdaten (werden ausschließlich über den Zahlungsanbieter verarbeitet)</li>
              <li>Buchungsdaten (Mietdauer, Fahrzeugtyp, Abholdatum)</li>
            </ul>
            <p className="mt-3">
              Diese Daten werden ausschließlich zur Abwicklung Ihrer Buchung und zur Kommunikation mit Ihnen verwendet. Eine Weitergabe an Dritte erfolgt nicht, soweit dies nicht zur Vertragserfüllung erforderlich ist.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-black mb-3">4. Rechtsgrundlage der Verarbeitung</h2>
            <p>
              Die Verarbeitung Ihrer Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) sowie Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einem sicheren und funktionsfähigen Betrieb unserer Website).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-black mb-3">5. Speicherdauer</h2>
            <p>
              Personenbezogene Daten werden nur so lange gespeichert, wie es für die jeweiligen Verarbeitungszwecke erforderlich ist. Buchungsdaten werden entsprechend der gesetzlichen Aufbewahrungsfristen (i. d. R. 10 Jahre gemäß HGB) gespeichert. Nach Ablauf dieser Fristen werden die Daten gelöscht.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-black mb-3">6. Cookies</h2>
            <p>
              Unsere Website verwendet technisch notwendige Cookies, um den Betrieb der Website zu gewährleisten. Diese Cookies speichern keine personenbezogenen Daten und werden nach dem Schließen des Browsers gelöscht. Eine Nutzung zu Werbezwecken findet nicht statt.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-black mb-3">7. Einbindung von Drittdiensten</h2>
            <p>
              Unsere Website bindet folgende Drittdienste ein:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>
                <strong className="text-brand-black">Mietrad.de</strong> — Buchungsplattform für Fahrradverleih. Bei der Nutzung gelten die Datenschutzbestimmungen von Mietrad.de.
              </li>
              <li>
                <strong className="text-brand-black">Google Maps</strong> — Zur Darstellung unseres Standorts. Beim Laden der Karte überträgt Ihr Browser Daten an Google. Es gelten die Datenschutzbestimmungen von Google LLC.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-black mb-3">8. Ihre Rechte</h2>
            <p>Sie haben gegenüber uns folgende Rechte hinsichtlich Ihrer personenbezogenen Daten:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
              <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
              <li>Recht auf Löschung (Art. 17 DSGVO)</li>
              <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
              <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
              <li>Recht auf Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
            </ul>
            <p className="mt-3">
              Zur Ausübung Ihrer Rechte wenden Sie sich bitte an:{' '}
              <a href="mailto:info@drahtesel-norderney.de" className="text-brand-red hover:underline">info@drahtesel-norderney.de</a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-black mb-3">9. Beschwerderecht</h2>
            <p>
              Sie haben das Recht, sich bei einer Datenschutzbehörde über die Verarbeitung Ihrer personenbezogenen Daten durch uns zu beschweren. Die zuständige Aufsichtsbehörde ist der Landesbeauftragte für den Datenschutz Niedersachsen.
            </p>
          </section>

          <p className="text-xs text-brand-gray pt-4 border-t border-gray-200">
            Drahtesel Fahrradverleih · Eleandro Pema · Herrenpfad 21–22 · 26548 Norderney
          </p>
        </div>
      </div>
    </div>
  )
}
