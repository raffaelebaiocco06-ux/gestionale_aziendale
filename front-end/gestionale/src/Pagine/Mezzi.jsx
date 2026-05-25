import { useEffect, useState } from "react";
import { getMezzi } from "../js/mezzi";

function Mezzi() {
  const [mezzi, setMezzi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState("");

  useEffect(() => {
    const caricamento = async () => {
      try {
        const risposta = await getMezzi();

        console.log(risposta.data);

        setMezzi(risposta.data.content);
      } catch (error) {
        console.error(error.response?.data || error);
        setErrore("Errore durante il caricamento dei mezzi");
      } finally {
        setLoading(false);
      }
    };

    caricamento();
  }, []);
  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-zinc-900">Gestione Mezzi</h1>

        <p className="mt-2 text-zinc-600">Qui visualizzerai tutti i mezzi aziendali.</p>

        {loading && <p className="mt-6">Caricamento mezzi...</p>}

        {errore && <div className="mt-6 rounded-xl bg-red-100 p-4 text-red-700">{errore}</div>}

        {!loading && mezzi.length === 0 && <p className="mt-6 text-zinc-500">Nessun mezzo presente.</p>}

        {!loading && mezzi.length > 0 && (
          <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow">
            <table className="w-full text-left">
              <thead className="bg-zinc-900 text-white">
                <tr>
                  <th className="p-4">Targa</th>
                  <th className="p-4">Marca</th>
                  <th className="p-4">Modello</th>
                  <th className="p-4">Tipo</th>
                  <th className="p-4">Anno</th>
                </tr>
              </thead>

              <tbody>
                {mezzi.map((mezzo) => (
                  <tr key={mezzo.id} className="border-b hover:bg-slate-50">
                    <td className="p-4">{mezzo.targa}</td>

                    <td className="p-4">{mezzo.marca}</td>

                    <td className="p-4">{mezzo.modello}</td>

                    <td className="p-4">{mezzo.tipo}</td>

                    <td className="p-4">{mezzo.anno}</td>
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

export default Mezzi;
