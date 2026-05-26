import { useEffect, useState } from "react";
import { getEntrate } from "../js/entrate";

function Entrate() {
  const [entrate, setEntrate] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState("");

  useEffect(() => {
    const caricaEntrate = async () => {
      try {
        const risposta = await getEntrate();
        setEntrate(risposta.data.content || risposta.data);
      } catch (error) {
        console.error(error);
        setErrore("Errore durante il caricamento delle entrate");
      } finally {
        setLoading(false);
      }
    };

    caricaEntrate();
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-zinc-900">Gestione Entrate</h1>

        <p className="mt-2 text-zinc-600">Qui puoi visualizzare tutte le entrate aziendali.</p>

        {loading && <p className="mt-6">Caricamento entrate...</p>}

        {errore && <div className="mt-6 rounded-xl bg-red-100 p-4 text-red-700">{errore}</div>}

        {!loading && entrate.length === 0 && <p className="mt-6 text-zinc-500">Nessuna entrata presente.</p>}

        {!loading && entrate.length > 0 && (
          <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow">
            <table className="w-full text-left">
              <thead className="bg-zinc-900 text-white">
                <tr>
                  <th className="p-4">Descrizione</th>
                  <th className="p-4">Importo</th>
                  <th className="p-4">Data</th>
                  <th className="p-4">Categoria</th>
                </tr>
              </thead>

              <tbody>
                {entrate.map((entrata) => (
                  <tr key={entrata.id} className="border-b hover:bg-slate-50">
                    <td className="p-4">{entrata.descrizione}</td>
                    <td className="p-4">€ {entrata.importo}</td>
                    <td className="p-4">{entrata.data}</td>
                    <td className="p-4">{entrata.categoria}</td>
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

export default Entrate;
