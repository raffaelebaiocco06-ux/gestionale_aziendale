import { Link } from "react-router-dom";
import logo from "../assets/Logo.png";
import dash from "../assets/dashboard.jpg";
import mezzo from "../assets/mezzo.png";
import ut from "../assets/utenti.png";
import scad from "../assets/scadenza.jpg";
import map from "../assets/mappa.jpg";

function Home() {
  return (
    <main className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-8 gap-12">
      <img className=" -mb-50 -mt-40  mx-auto" src={logo} alt="Logo gestionale" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 w-full max-w-6xl">
        {/* dashboard */}
        <div className="flex flex-col items-center text-center">
          <img className="w-48 h-auto object-contain rounded-2xl mb-2" src={dash} alt="Dashboard" />
          <p className="text-sm text-slate-600 max-w-xs">Permette di visualizzare i dati da una dashboard intuitiva e completa</p>
        </div>
        {/* mezzi */}
        <div className="flex flex-col items-center text-center">
          <img className="w-48 h-auto object-contain rounded-2xl mb-2" src={mezzo} alt="Mezzi" />
          <p className="text-sm text-slate-600 max-w-xs">Gestisci i mezzi aziendali e monitora lo stato di ogni veicolo</p>
        </div>
        {/* utenti */}
        <div className="flex flex-col items-center text-center">
          <img className="w-48 h-auto object-contain rounded-2xl mb-2" src={ut} alt="Utenti" />
          <p className="text-sm text-slate-600 max-w-xs">Controlla clienti e fornitori</p>
        </div>
        {/* scadenze */}
        <div className="flex flex-col items-center text-center">
          <img className="w-48 h-auto object-contain rounded-2xl mb-2" src={scad} alt="Scadenze" />
          <p className="text-sm text-slate-600 max-w-xs">Tieni traccia di tutte le scadenze e ricevi avvisi dedicati</p>
        </div>
        {/* mappe */}
        <div className="flex flex-col items-center text-center">
          <img className="w-48 h-auto object-contain rounded-2xl mb-2" src={map} alt="Mappe" />
          <p className="text-sm text-slate-600 max-w-xs">Visualizza le mappe della fiera e organizza gli spazi espositivi</p>
        </div>
      </div>

      {/* card */}
      <div className="max-w-3xl p-10 text-center w-full">
        <p className="text-slate-600 text-lg mb-8">
          Una piattaforma semplice per gestire mezzi, scadenze, utenti, documenti, mappe fiera e attività aziendali in un unico posto.
        </p>

        <div className="flex justify-center gap-4">
          <Link to="/registrazione" className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-400">
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
