import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="border-b bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-slate-800">
          Gestionale
        </Link>

        {/* Menu Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/dashboard" className="text-slate-600 hover:text-blue-600 transition">
            Dashboard
          </Link>

          <Link to="/mezzi" className="text-slate-600 hover:text-blue-600 transition">
            Mezzi
          </Link>

          <Link to="/utenti" className="text-slate-600 hover:text-blue-600 transition">
            Utenti
          </Link>

          <Link to="/scadenze" className="text-slate-600 hover:text-blue-600 transition">
            Scadenze
          </Link>

          <Link to="/mappe" className="text-slate-600 hover:text-blue-600 transition">
            Mappe
          </Link>
        </nav>

        {/* Bottoni */}
        <div className="flex items-center gap-3">
          <Link to="/login" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition">
            Login
          </Link>

          <Link to="/registrazione" className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition">
            Registrati
          </Link>
        </div>
      </div>
    </header>
  );
}
export default Navbar;
