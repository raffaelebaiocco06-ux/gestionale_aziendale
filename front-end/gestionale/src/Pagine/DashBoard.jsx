import { useEffect, useState } from "react";
import { getDashboard } from "../js/dashboard";

function Dashboard() {
  const [dati, setDati] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState("");

  useEffect(() => {
    const caricaDashboard = async () => {
      try {
        const risposta = await getDashboard();
        setDati(risposta.data);
      } catch (error) {
        console.error(error);
        setErrore("Errore durante il caricamento della dashboard");
      } finally {
        setLoading(false);
      }
    };

    caricaDashboard();
  }, []);

  const euro = (valore) => {
    return Number(valore || 0).toLocaleString("it-IT", {
      style: "currency",
      currency: "EUR",
    });
  };

  if (loading) {
    return (
      <main className="p-8">
        <p>Caricamento dashboard...</p>
      </main>
    );
  }

  if (errore) {
    return (
      <main className="p-8">
        <div className="rounded-xl bg-red-100 p-4 text-red-700">{errore}</div>
      </main>
    );
  }

  return (
    <main className="p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-zinc-900">Dashboard</h1>

        <p className="mt-2 text-zinc-600">Riepilogo generale dell’andamento aziendale.</p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow">
            <p className="text-sm font-semibold text-zinc-500">Totale entrate</p>
            <h2 className="mt-3 text-3xl font-bold text-emerald-600">{euro(dati?.totaleEntrate)}</h2>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            <p className="text-sm font-semibold text-zinc-500">Totale uscite</p>
            <h2 className="mt-3 text-3xl font-bold text-red-600">{euro(dati?.totaleUscite)}</h2>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            <p className="text-sm font-semibold text-zinc-500">Utile</p>
            <h2 className={`mt-3 text-3xl font-bold ${Number(dati?.utile || 0) >= 0 ? "text-emerald-600" : "text-red-600"}`}>{euro(dati?.utile)}</h2>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-4">
          <div className="rounded-2xl bg-white p-6 shadow">
            <p className="text-sm font-semibold text-zinc-500">Clienti</p>
            <h3 className="mt-3 text-3xl font-bold">{dati?.numeroClienti}</h3>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            <p className="text-sm font-semibold text-zinc-500">Fornitori</p>
            <h3 className="mt-3 text-3xl font-bold">{dati?.numeroFornitori}</h3>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            <p className="text-sm font-semibold text-zinc-500">Mezzi</p>
            <h3 className="mt-3 text-3xl font-bold">{dati?.numeroMezzi}</h3>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            <p className="text-sm font-semibold text-zinc-500">Movimenti</p>
            <h3 className="mt-3 text-3xl font-bold">{dati?.numeroMovimenti}</h3>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow">
            <p className="text-sm font-semibold text-zinc-500">Scadenze imminenti</p>
            <h3 className="mt-3 text-3xl font-bold text-orange-500">{dati?.scadenzeImminenti}</h3>
            <p className="mt-2 text-sm text-zinc-500">Scadenze entro i prossimi 30 giorni.</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            <p className="text-sm font-semibold text-zinc-500">Scadenze scadute</p>
            <h3 className="mt-3 text-3xl font-bold text-red-600">{dati?.scadenzeScadute}</h3>
            <p className="mt-2 text-sm text-zinc-500">Scadenze già superate.</p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
