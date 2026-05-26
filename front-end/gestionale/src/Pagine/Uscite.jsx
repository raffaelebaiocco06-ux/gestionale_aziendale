import { useEffect, useState } from "react";
import { getUscite } from "../js/uscite";

function Uscite() {
  const [uscite, setUscite] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState("");

  useEffect(() => {
    const caricaUscite = async () => {
      try {
        const risposta = await getUscite();
        setUscite(risposta.data.content || risposta.data);
      } catch (error) {
        console.error(error);
        setErrore("Errore durante il caricamento delle uscite");
      } finally {
        setLoading(false);
      }
    };

    caricaUscite();
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-zinc-900">Gestione Uscite</h1>

        <p className="mt-2 text-zinc-600">Qui puoi visualizzare tutte le uscite aziendali.</p>

        {loading && <p className="mt-6">Caricamento uscite...</p>}

        {errore && <div className="mt-6 rounded-xl bg-red-100 p-4 text-red-700">{errore}</div>}

        {!loading && uscite.length === 0 && <p className="mt-6 text-zinc-500">Nessuna uscita presente.</p>}

        {!loading && uscite.length > 0 && (
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
                {uscite.map((uscita) => (
                  <tr key={uscita.id} className="border-b hover:bg-slate-50">
                    <td className="p-4">{uscita.descrizione}</td>
                    <td className="p-4">€ {uscita.importo}</td>
                    <td className="p-4">{uscita.data}</td>
                    <td className="p-4">{uscita.categoria}</td>
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

export default Uscite;
