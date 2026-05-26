import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/Logo.png";

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-zinc-950 text-white shadow-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Logo Gestionale" className="h-12 w-12 rounded-xl object-contain bg-white p-1" />
        </Link>

        {/* Menu Desktop */}
        <nav className="hidden items-center gap-7 md:flex">
          <Link className="hover:text-emerald-400 transition" to="/dashboard">
            Dashboard
          </Link>
          <Link className="hover:text-emerald-400 transition" to="/mezzi">
            Mezzi
          </Link>
          <Link className="hover:text-emerald-400 transition" to="/utenti">
            Utenti
          </Link>
          <Link className="hover:text-emerald-400 transition" to="/scadenze">
            Scadenze
          </Link>
          <Link className="hover:text-emerald-400 transition" to="/entrate">
            Entrate
          </Link>
          <Link className="hover:text-emerald-400 transition" to="/uscite">
            Uscite
          </Link>
          <Link className="hover:text-emerald-400 transition" to="/mappe">
            Mappe
          </Link>
        </nav>

        {/* Bottoni Desktop */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/login"
            className="rounded-xl border border-emerald-400 px-4 py-2 text-sm font-semibold text-emerald-400 hover:bg-emerald-400 hover:text-zinc-950 transition"
          >
            Login
          </Link>

          <Link to="/registrazione" className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-emerald-400 transition">
            Registrati
          </Link>
        </div>

        {/* Bottone Mobile */}
        <button onClick={() => setOpen(!open)} className="md:hidden rounded-lg border border-zinc-700 px-3 py-2 text-2xl">
          ☰
        </button>
      </div>

      {/* Menu Mobile */}
      {open && (
        <div className="border-t border-zinc-800 bg-zinc-900 px-6 py-5 md:hidden">
          <nav className="flex flex-col gap-4">
            <Link onClick={() => setOpen(false)} to="/dashboard">
              Dashboard
            </Link>
            <Link onClick={() => setOpen(false)} to="/mezzi">
              Mezzi
            </Link>
            <Link onClick={() => setOpen(false)} to="/utenti">
              Utenti
            </Link>
            <Link onClick={() => setOpen(false)} to="/scadenze">
              Scadenze
            </Link>
            <Link onClick={() => setOpen(false)} to="/mappe">
              Mappe
            </Link>

            <div className="mt-4 flex flex-col gap-3">
              <Link
                onClick={() => setOpen(false)}
                to="/login"
                className="rounded-xl border border-emerald-400 px-4 py-2 text-center font-semibold text-emerald-400"
              >
                Login
              </Link>

              <Link onClick={() => setOpen(false)} to="/registrazione" className="rounded-xl bg-emerald-500 px-4 py-2 text-center font-semibold text-zinc-950">
                Registrati
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;
