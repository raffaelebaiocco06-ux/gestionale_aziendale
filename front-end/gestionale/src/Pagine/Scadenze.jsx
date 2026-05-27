import { useEffect, useState } from "react";
import { getScadenze, createScadenza, updateScadenza, deleteScadenza } from "../js/scadenze";
import { getMezzi } from "../js/mezzi";
import Modale from "../Components/Modale";

function Scadenze() {
  const [scadenze, setScadenze] = useState([]);
  const [mezzi, setMezzi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState("");
  const [cerca, setCerca] = useState("");
  const [filtroStato, setFiltroStato] = useState("TUTTE");
  const [modaleAperta, setModaleAperta] = useState(false);
  const [scadenzaInModifica, setScadenzaInModifica] = useState(null);

  const formVuoto = {
    titolo: "",
    descrizione: "",
    dataScadenza: "",
    tipo: "ALTRO",
    stato: "DA_FARE",
    mezzoId: "",
  };

  const [form, setForm] = useState(formVuoto);

  useEffect(() => {
    const caricaDati = async () => {
      try {
        setLoading(true);

        const [rispostaScadenze, rispostaMezzi] = await Promise.all([getScadenze(), getMezzi()]);

        setScadenze(rispostaScadenze.data.content || rispostaScadenze.data);
        setMezzi(rispostaMezzi.data.content || rispostaMezzi.data);
      } catch (error) {
        console.error(error);
        setErrore("Errore durante il caricamento delle scadenze");
      } finally {
        setLoading(false);
      }
    };
    caricaDati();
  }, []);

  const cambiaValore = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const apriNuovaScadenza = () => {
    setScadenzaInModifica(null);
    setForm(formVuoto);
    setModaleAperta(true);
  };

  const apriModificaScadenza = (scadenza) => {
    setScadenzaInModifica(scadenza);

    setForm({
      titolo: scadenza.titolo || "",
      descrizione: scadenza.descrizione || "",
      dataScadenza: scadenza.dataScadenza || "",
      tipo: scadenza.tipo || "ALTRO",
      stato: scadenza.stato || "DA_FARE",
      mezzoId: scadenza.mezzo?.id || "",
    });

    setModaleAperta(true);
  };

  const salvaScadenza = async (e) => {
    e.preventDefault();

    try {
      const datiDaInviare = {
        ...form,
        mezzoId: form.mezzoId || null,
      };

      if (scadenzaInModifica) {
        const risposta = await updateScadenza(scadenzaInModifica.id, datiDaInviare);

        setScadenze((listaAttuale) => listaAttuale.map((scadenza) => (scadenza.id === scadenzaInModifica.id ? risposta.data : scadenza)));
      } else {
        const risposta = await createScadenza(datiDaInviare);
        setScadenze((listaAttuale) => [...listaAttuale, risposta.data]);
      }

      setForm(formVuoto);
      setScadenzaInModifica(null);
      setModaleAperta(false);
      setErrore("");
    } catch (error) {
      console.error(error);
      setErrore("Errore durante il salvataggio della scadenza");
    }
  };

  const eliminaScadenza = async (id) => {
    const conferma = window.confirm("Vuoi eliminare questa scadenza?");
    if (!conferma) return;

    try {
      await deleteScadenza(id);

      setScadenze((listaAttuale) => listaAttuale.filter((scadenza) => scadenza.id !== id));
    } catch (error) {
      console.error(error);
      setErrore("Errore durante l'eliminazione della scadenza");
    }
  };

  const calcolaStatoVisivo = (scadenza) => {
    const oggi = new Date();
    const data = new Date(scadenza.dataScadenza);

    oggi.setHours(0, 0, 0, 0);
    data.setHours(0, 0, 0, 0);

    if (scadenza.stato === "COMPLETATA") {
      return "COMPLETATA";
    }

    if (data < oggi) {
      return "SCADUTA";
    }

    return scadenza.stato;
  };

  const classeStato = (stato) => {
    if (stato === "COMPLETATA") {
      return "bg-emerald-100 text-emerald-700";
    }

    if (stato === "SCADUTA") {
      return "bg-red-100 text-red-700";
    }

    return "bg-orange-100 text-orange-700";
  };

  const scadenzeFiltrate = scadenze.filter((scadenza) => {
    const statoVisivo = calcolaStatoVisivo(scadenza);

    const matchStato = filtroStato === "TUTTE" || statoVisivo === filtroStato;

    const testo = `
      ${scadenza.titolo || ""}
      ${scadenza.descrizione || ""}
      ${scadenza.tipo || ""}
      ${scadenza.stato || ""}
      ${scadenza.dataScadenza || ""}
      ${scadenza.mezzo?.targa || ""}
      ${scadenza.mezzo?.marca || ""}
      ${scadenza.mezzo?.modello || ""}
    `.toLowerCase();

    const matchCerca = testo.includes(cerca.toLowerCase());

    return matchStato && matchCerca;
  });

  return (
    <main className="p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-bold text-zinc-900 md:text-3xl">Gestione Scadenze</h1>

        <p className="mt-2 text-sm text-zinc-600 md:text-base">Qui puoi controllare assicurazioni, bolli, revisioni, pagamenti e altre scadenze aziendali.</p>

        <div className="mt-8 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col gap-3 md:flex-row">
            <input
              type="text"
              placeholder="Cerca scadenza..."
              value={cerca}
              onChange={(e) => setCerca(e.target.value)}
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500 md:w-80"
            />

            <select
              value={filtroStato}
              onChange={(e) => setFiltroStato(e.target.value)}
              className="rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500"
            >
              <option value="TUTTE">Tutte</option>
              <option value="DA_FARE">Da fare</option>
              <option value="COMPLETATA">Completate</option>
              <option value="SCADUTA">Scadute</option>
            </select>
          </div>

          <button onClick={apriNuovaScadenza} className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-white hover:bg-emerald-400">
            + Aggiungi scadenza
          </button>
        </div>

        {loading && <p className="mt-6">Caricamento scadenze...</p>}

        {errore && <div className="mt-6 rounded-xl bg-red-100 p-4 text-red-700">{errore}</div>}

        {!loading && scadenzeFiltrate.length === 0 && <p className="mt-6 text-zinc-500">Nessuna scadenza trovata.</p>}

        {!loading && scadenzeFiltrate.length > 0 && (
          <div className="mt-8 overflow-x-auto rounded-2xl bg-white shadow">
            <table className="w-full text-left">
              <thead className="bg-zinc-900 text-white">
                <tr>
                  <th className="p-4">Titolo</th>
                  <th className="p-4">Tipo</th>
                  <th className="p-4">Data</th>
                  <th className="p-4">Stato</th>
                  <th className="p-4">Mezzo</th>
                  <th className="p-4">Descrizione</th>
                  <th className="p-4">Azioni</th>
                </tr>
              </thead>

              <tbody>
                {scadenzeFiltrate.map((scadenza) => {
                  const statoVisivo = calcolaStatoVisivo(scadenza);

                  return (
                    <tr key={scadenza.id} className="border-b hover:bg-slate-50">
                      <td className="p-4 font-semibold">{scadenza.titolo}</td>
                      <td className="p-4">{scadenza.tipo}</td>
                      <td className="p-4">{scadenza.dataScadenza}</td>
                      <td className="p-4">
                        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${classeStato(statoVisivo)}`}>{statoVisivo}</span>
                      </td>
                      <td className="p-4">{scadenza.mezzo ? `${scadenza.mezzo.targa} - ${scadenza.mezzo.marca} ${scadenza.mezzo.modello}` : "Nessun mezzo"}</td>
                      <td className="p-4">{scadenza.descrizione}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => apriModificaScadenza(scadenza)}
                            className="rounded-lg bg-blue-500 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-400"
                          >
                            Modifica
                          </button>

                          <button
                            onClick={() => eliminaScadenza(scadenza.id)}
                            className="rounded-lg bg-red-500 px-3 py-2 text-sm font-semibold text-white hover:bg-red-400"
                          >
                            Elimina
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {modaleAperta && (
          <Modale titolo={scadenzaInModifica ? "Modifica scadenza" : "Aggiungi scadenza"} onClose={() => setModaleAperta(false)}>
            <form onSubmit={salvaScadenza} className="space-y-4">
              <input
                type="text"
                name="titolo"
                placeholder="Titolo"
                value={form.titolo}
                onChange={cambiaValore}
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500"
                required
              />

              <textarea
                name="descrizione"
                placeholder="Descrizione"
                value={form.descrizione}
                onChange={cambiaValore}
                className="min-h-24 w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500"
                required
              />

              <input
                type="date"
                name="dataScadenza"
                value={form.dataScadenza}
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
                <option value="ASSICURAZIONE">Assicurazione</option>
                <option value="BOLLO">Bollo</option>
                <option value="REVISIONE">Revisione</option>
                <option value="PAGAMENTO">Pagamento</option>
                <option value="ALTRO">Altro</option>
              </select>

              <select
                name="stato"
                value={form.stato}
                onChange={cambiaValore}
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500"
                required
              >
                <option value="DA_FARE">Da fare</option>
                <option value="COMPLETATA">Completata</option>
                <option value="SCADUTA">Scaduta</option>
              </select>

              <select
                name="mezzoId"
                value={form.mezzoId}
                onChange={cambiaValore}
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500"
              >
                <option value="">Nessun mezzo collegato</option>
                {mezzi.map((mezzo) => (
                  <option key={mezzo.id} value={mezzo.id}>
                    {mezzo.targa} - {mezzo.marca} {mezzo.modello}
                  </option>
                ))}
              </select>

              <button type="submit" className="w-full rounded-xl bg-emerald-500 py-3 font-semibold text-white hover:bg-emerald-400">
                {scadenzaInModifica ? "Salva modifiche" : "Salva scadenza"}
              </button>
            </form>
          </Modale>
        )}
      </div>
    </main>
  );
}

export default Scadenze;
