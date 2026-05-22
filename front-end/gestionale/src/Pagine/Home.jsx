import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-6">
      <div className="max-w-3xl bg-white rounded-2xl shadow p-10 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Gestionale Aziendale</h1>

        <p className="text-slate-600 text-lg mb-8">
          Una piattaforma semplice per gestire mezzi, scadenze, utenti, documenti, mappe fiera e attività aziendali in un unico posto.
        </p>

        <div className="flex justify-center gap-4">
          <Link to="/registrazione" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700">
            Registrati
          </Link>

          <Link to="/login" className="border border-slate-300 px-6 py-3 rounded-xl font-semibold hover:bg-slate-100">
            Accedi
          </Link>
        </div>
      </div>
    </main>
  );
}
export default Home;
