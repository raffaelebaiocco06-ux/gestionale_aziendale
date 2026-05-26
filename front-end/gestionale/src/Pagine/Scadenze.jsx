import { useEffect, useState } from "react";
import { getScadenze } from "../js/scadenze";

function Scadenze() {
  const [scadenze, setScadenze] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState("");

  useEffect(() => {
    const caricaScadenze = async () => {
      try {
        const risposta = await getScadenze();

        console.log(risposta.data);

        setScadenze(risposta.data.content || risposta.data);
      } catch (error) {
        console.error(error.response?.data || error);
        setErrore("Errore durante il caricamento delle scadenze");
      } finally {
        setLoading(false);
      }
    };

    caricaScadenze();
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-zinc-900">Gestione Scadenze</h1>

        <p className="mt-2 text-zinc-600">Qui puoi visualizzare e gestire tutte le scadenze aziendali.</p>

        {loading && <p className="mt-6">Caricamento scadenze...</p>}

        {errore && <div className="mt-6 rounded-xl bg-red-100 p-4 text-red-700">{errore}</div>}

        {!loading && scadenze.length === 0 && <p className="mt-6 text-zinc-500">Nessuna scadenza presente.</p>}

        {!loading && scadenze.length > 0 && (
          <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow">
            <table className="w-full text-left">
              <thead className="bg-zinc-900 text-white">
                <tr>
                  <th className="p-4">Titolo</th>
                  <th className="p-4">Descrizione</th>
                  <th className="p-4">Data</th>
                  <th className="p-4">Stato</th>
                </tr>
              </thead>

              <tbody>
                {scadenze.map((scadenza) => (
                  <tr key={scadenza.id} className="border-b hover:bg-slate-50">
                    <td className="p-4">{scadenza.titolo}</td>
                    <td className="p-4">{scadenza.descrizione}</td>
                    <td className="p-4">{scadenza.dataScadenza}</td>
                    <td className="p-4">{scadenza.stato}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}

export default Scadenze;
