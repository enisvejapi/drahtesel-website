export default function ImpressumPage() {
  return (
    <div className="pt-20 min-h-screen bg-white">
      <div className="bg-brand-muted border-b border-gray-200">
        <div className="container-site py-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-brand-black mb-2">Impressum</h1>
          <p className="text-brand-gray">Angaben gemäß § 5 TMG</p>
        </div>
      </div>

      <div className="container-site py-12 pb-20 max-w-3xl">
        <div className="prose prose-gray max-w-none space-y-8 text-brand-gray leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-brand-black mb-3">Anbieter</h2>
            <p>
              Eleandro Pema<br />
              Drahtesel Fahrradverleih<br />
              Herrenpfad 21–22<br />
              26548 Norderney<br />
              Deutschland
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand-black mb-3">Kontakt</h2>
            <p>
              Telefon: <a href="tel:+4949324980397" className="text-brand-red hover:underline">+49 4932 4980397</a><br />
              E-Mail: <a href="mailto:info@drahtesel-norderney.de" className="text-brand-red hover:underline">info@drahtesel-norderney.de</a><br />
              Website: <a href="https://www.drahtesel-norderney.de" className="text-brand-red hover:underline">www.drahtesel-norderney.de</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand-black mb-3">Umsatzsteuer-ID</h2>
            <p>
              Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:<br />
              <span className="text-brand-black font-medium">[USt-IdNr. eintragen]</span>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand-black mb-3">Verantwortlich für den Inhalt</h2>
            <p>
              Drahtesel Fahrradverleih<br />
              Herrenpfad 21–22<br />
              26548 Norderney
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand-black mb-3">Streitschlichtung</h2>
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
              <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-brand-red hover:underline">
                https://ec.europa.eu/consumers/odr/
              </a>
            </p>
            <p className="mt-2">
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand-black mb-3">Haftung für Inhalte</h2>
            <p>
              Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
            </p>
            <p className="mt-2">
              Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand-black mb-3">Urheberrecht</h2>
            <p>
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
