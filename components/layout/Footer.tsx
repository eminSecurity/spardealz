export function Footer() {
  return (
    <footer className="bg-secondary-50 border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-secondary mb-3">SparDealz</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-primary">Über uns</a></li>
              <li><a href="#" className="hover:text-primary">Karriere</a></li>
              <li><a href="#" className="hover:text-primary">Blog</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-secondary mb-3">Community</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-primary">Regeln</a></li>
              <li><a href="#" className="hover:text-primary">Hilfe</a></li>
              <li><a href="#" className="hover:text-primary">Kontakt</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-secondary mb-3">Rechtliches</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-primary">Impressum</a></li>
              <li><a href="#" className="hover:text-primary">Datenschutz</a></li>
              <li><a href="#" className="hover:text-primary">AGB</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-secondary mb-3">Folge uns</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-primary">Discord</a></li>
              <li><a href="#" className="hover:text-primary">Twitter</a></li>
              <li><a href="#" className="hover:text-primary">Instagram</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          © 2026 SparDealz. Alle Rechte vorbehalten. Made with 🔥 in Berlin.
        </div>
      </div>
    </footer>
  )
}
