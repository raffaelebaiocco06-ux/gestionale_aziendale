import { NavLink } from "react-router-dom";

function Sidebar() {
  const linkClass = ({ isActive }) =>
    isActive
      ? "block rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-white"
      : "block rounded-xl px-4 py-3 font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-white";

  return (
    <aside className="min-h-screen w-72 bg-zinc-950 p-6 text-white">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-emerald-400">Gestionale</h1>
        <p className="mt-1 text-sm text-zinc-400">Azienda & Contabilità</p>
      </div>

      <nav className="space-y-2">
        <NavLink to="/dashboard" className={linkClass}>
          Dashboard
        </NavLink>

        <NavLink to="/movimenti" className={linkClass}>
          Movimenti
        </NavLink>

        <NavLink to="/clienti" className={linkClass}>
          Clienti
        </NavLink>

        <NavLink to="/fornitori" className={linkClass}>
          Fornitori
        </NavLink>

        <NavLink to="/progetti" className={linkClass}>
          Progetti
        </NavLink>

        <NavLink to="/mezzi" className={linkClass}>
          Mezzi
        </NavLink>

        <NavLink to="/scadenze" className={linkClass}>
          Scadenze
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
