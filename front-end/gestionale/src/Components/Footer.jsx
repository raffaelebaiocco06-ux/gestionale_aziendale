function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 text-zinc-300">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-12 md:grid-cols-3">
        {/* Logo / Descrizione */}
        <div>
          <h2 className="text-2xl font-bold text-white">Gestionale</h2>

          <p className="mt-4 text-sm leading-6 text-zinc-400">
            Piattaforma gestionale moderna per la gestione di utenti, mezzi, scadenze, documenti e attività aziendali.
          </p>
        </div>

        {/* Navigazione */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">Navigazione</h3>

          <ul className="space-y-3 text-sm">
            <li>
              <a href="/" className="hover:text-emerald-400 transition">
                Home
              </a>
            </li>

            <li>
              <a href="/login" className="hover:text-emerald-400 transition">
                Login
              </a>
            </li>

            <li>
              <a href="/registrazione" className="hover:text-emerald-400 transition">
                Registrazione
              </a>
            </li>

            <li>
              <a href="/dashboard" className="hover:text-emerald-400 transition">
                Dashboard
              </a>
            </li>
          </ul>
        </div>

        {/* Contatti */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">Contatti</h3>

          <ul className="space-y-3 text-sm text-zinc-400">
            <li>Email: info@gestionale.it</li>
            <li>Telefono: +39 000 000000</li>
            <li>Italia</li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-zinc-800 py-4 text-center text-sm text-zinc-500">© 2026 Gestionale Aziendale — Tutti i diritti riservati</div>
    </footer>
  );
}

export default Footer;
