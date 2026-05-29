import { useEffect, useState } from "react";
import { getMezzi, deleteMezzo } from "../js/mezzi";

function Mezzi() {
  const [mezzi, setMezzi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState("");
  const [cerca, setCerca] = useState("");

  useEffect(() => {
    const caricaMezzi = async () => {
      try {
        const risposta = await getMezzi();
        setMezzi(risposta.data.content || risposta.data);
      } catch (error) {
        console.error(error);
        setErrore("Errore durante il caricamento dei mezzi");
      } finally {
        setLoading(false);
      }
    };

    caricaMezzi();
  }, []);

  const eliminaMezzo = async (id) => {
    const conferma = window.confirm("Vuoi eliminare questo mezzo?");
    if (!conferma) return;

    try {
      await deleteMezzo(id);
      setMezzi((listaAttuale) => listaAttuale.filter((mezzo) => mezzo.id !== id));
    } catch (error) {
      console.error(error);
      setErrore("Errore durante l'eliminazione del mezzo");
    }
  };

  const mezziFiltrati = mezzi.filter((mezzo) => {
    const testo = `
      ${mezzo.targa || ""}
      ${mezzo.marca || ""}
      ${mezzo.modello || ""}
      ${mezzo.tipo || ""}
      ${mezzo.anno || ""}
    `.toLowerCase();

    return testo.includes(cerca.toLowerCase());
  });

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-zinc-900">Gestione Mezzi</h1>

        <p className="mt-2 text-zinc-600">Qui puoi visualizzare e gestire tutti i mezzi aziendali.</p>

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <input
            type="text"
            placeholder="Cerca mezzo..."
            value={cerca}
            onChange={(e) => setCerca(e.target.value)}
            className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500 md:max-w-sm"
          />

          <button className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-white hover:bg-emerald-400">+ Aggiungi mezzo</button>
        </div>

        {loading && <p className="mt-6">Caricamento mezzi...</p>}

        {errore && <div className="mt-6 rounded-xl bg-red-100 p-4 text-red-700">{errore}</div>}

        {!loading && mezziFiltrati.length === 0 && <p className="mt-6 text-zinc-500">Nessun mezzo trovato.</p>}

        {!loading && mezziFiltrati.length > 0 && (
          <div className="mt-8 overflow-x-auto rounded-2xl bg-white shadow">
            <table className="w-full text-left">
              <thead className="bg-zinc-900 text-white">
                <tr>
                  <th className="p-4">Targa</th>
                  <th className="p-4">Marca</th>
                  <th className="p-4">Modello</th>
                  <th className="p-4">Tipo</th>
                  <th className="p-4">Anno</th>
                  <th className="p-4">Assicurazione</th>
                  <th className="p-4">Bollo</th>
                  <th className="p-4">Revisione</th>
                  <th className="p-4">Azioni</th>
                </tr>
              </thead>

              <tbody>
                {mezziFiltrati.map((mezzo) => (
                  <tr key={mezzo.id} className="border-b hover:bg-slate-50">
                    <td className="p-4 font-semibold">{mezzo.targa}</td>
                    <td className="p-4">{mezzo.marca}</td>
                    <td className="p-4">{mezzo.modello}</td>
                    <td className="p-4">{mezzo.tipo}</td>
                    <td className="p-4">{mezzo.anno}</td>
                    <td className="p-4">{mezzo.assicurazioneScadenza}</td>
                    <td className="p-4">{mezzo.bolloScadenza}</td>
                    <td className="p-4">{mezzo.revisioneScadenza}</td>
                    <td className="p-4">
                      <button
                        onClick={() => eliminaMezzo(mezzo.id)}
                        className="rounded-lg bg-red-500 px-3 py-2 text-sm font-semibold text-white hover:bg-red-400"
                      >
                        Elimina
                      </button>
                    </td>
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
