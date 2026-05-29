import { useEffect, useState } from "react";
import { createMezzo, deleteMezzo, getMezzi } from "../js/mezzi";
import Modale from "../Components/Modale";

function Mezzi() {
  const formVuoto = {
    targa: "",
    marca: "",
    modello: "",
    tipo: "AUTO",
    anno: "",
    assicurazioneScadenza: "",
    bolloScadenza: "",
    revisioneScadenza: "",
  };

  const [mezzi, setMezzi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState("");
  const [cerca, setCerca] = useState("");
  const [modaleAperta, setModaleAperta] = useState(false);
  const [form, setForm] = useState(formVuoto);

  const estraiLista = (data) => data?.content || data || [];

  useEffect(() => {
    const caricaMezzi = async () => {
      try {
        setLoading(true);
        setErrore("");
        const risposta = await getMezzi();
        setMezzi(estraiLista(risposta.data));
      } catch (error) {
        console.error(error);
        setErrore("Errore durante il caricamento dei mezzi");
      } finally {
        setLoading(false);
      }
    };
    caricaMezzi();
  }, []);

  const cambiaValore = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const apriNuovoMezzo = () => {
    setForm(formVuoto);
    setErrore("");
    setModaleAperta(true);
  };

  const salvaMezzo = async (e) => {
    e.preventDefault();

    try {
      const datiDaInviare = {
        targa: form.targa.trim().toUpperCase(),
        marca: form.marca.trim(),
        modello: form.modello.trim(),
        tipo: form.tipo,
        anno: Number(form.anno),
        assicurazioneScadenza: form.assicurazioneScadenza,
        bolloScadenza: form.bolloScadenza,
        revisioneScadenza: form.revisioneScadenza,
      };

      const risposta = await createMezzo(datiDaInviare);

      setMezzi((listaAttuale) => [...listaAttuale, risposta.data]);
      setForm(formVuoto);
      setErrore("");
      setModaleAperta(false);
    } catch (error) {
      console.error(error);
      setErrore(error.response?.data?.message || "Errore durante il salvataggio del mezzo");
    }
  };

  const eliminaMezzo = async (id) => {
    const conferma = window.confirm("Vuoi eliminare questo mezzo?");
    if (!conferma) return;

    try {
      await deleteMezzo(id);
      setMezzi((listaAttuale) => listaAttuale.filter((mezzo) => mezzo.id !== id));
      setErrore("");
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

          <button onClick={apriNuovoMezzo} className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-white hover:bg-emerald-400">
            + Aggiungi mezzo
          </button>
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

        {modaleAperta && (
          <Modale titolo="Aggiungi mezzo" onClose={() => setModaleAperta(false)}>
            <form onSubmit={salvaMezzo} className="space-y-4">
              <input
                type="text"
                name="targa"
                placeholder="Targa"
                value={form.targa}
                onChange={cambiaValore}
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 uppercase outline-none focus:border-emerald-500"
                required
              />

              <input
                type="text"
                name="marca"
                placeholder="Marca"
                value={form.marca}
                onChange={cambiaValore}
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500"
                required
              />

              <input
                type="text"
                name="modello"
                placeholder="Modello"
                value={form.modello}
                onChange={cambiaValore}
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500"
                required
              />

              <select
                name="tipo"
                value={form.tipo}
                onChange={cambiaValore}
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500"
                required
              >
                <option value="AUTO">Auto</option>
                <option value="FURGONE">Furgone</option>
                <option value="CAMION">Camion</option>
              </select>

              <input
                type="number"
                name="anno"
                placeholder="Anno"
                value={form.anno}
                onChange={cambiaValore}
                min="1900"
                max="2100"
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500"
                required
              />

              <div>
                <label className="mb-1 block text-sm font-semibold text-zinc-700">Scadenza assicurazione</label>
                <input
                  type="date"
                  name="assicurazioneScadenza"
                  value={form.assicurazioneScadenza}
                  onChange={cambiaValore}
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-zinc-700">Scadenza bollo</label>
                <input
                  type="date"
                  name="bolloScadenza"
                  value={form.bolloScadenza}
                  onChange={cambiaValore}
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-zinc-700">Scadenza revisione</label>
                <input
                  type="date"
                  name="revisioneScadenza"
                  value={form.revisioneScadenza}
                  onChange={cambiaValore}
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <button type="submit" className="w-full rounded-xl bg-emerald-500 py-3 font-semibold text-white hover:bg-emerald-400">
                Salva mezzo
              </button>
            </form>
          </Modale>
        )}
      </div>
    </main>
  );
}

export default Mezzi;
