import { useEffect, useState } from "react";
import { getProgetti, createProgetto, updateProgetto, deleteProgetto } from "../js/progetti";
import { getClienti } from "../js/clienti";
import Modale from "../Components/Modale";

function Progetti() {
  const [progetti, setProgetti] = useState([]);
  const [clienti, setClienti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState("");
  const [cerca, setCerca] = useState("");
  const [filtroStato, setFiltroStato] = useState("TUTTI");
  const [modaleAperta, setModaleAperta] = useState(false);
  const [progettoInModifica, setProgettoInModifica] = useState(null);

  const formVuoto = {
    nome: "",
    descrizione: "",
    dataInizio: "",
    dataFine: "",
    stato: "DA_INIZIARE",
    budget: "",
    clienteId: "",
  };

  const [form, setForm] = useState(formVuoto);

  useEffect(() => {
    const caricaDati = async () => {
      try {
        setLoading(true);

        const [rispostaProgetti, rispostaClienti] = await Promise.all([getProgetti(), getClienti()]);

        setProgetti(rispostaProgetti.data.content || rispostaProgetti.data);
        setClienti(rispostaClienti.data.content || rispostaClienti.data);
      } catch (error) {
        console.error(error);
        setErrore("Errore durante il caricamento dei progetti");
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

  const apriNuovoProgetto = () => {
    setProgettoInModifica(null);
    setForm(formVuoto);
    setModaleAperta(true);
  };

  const apriModificaProgetto = (progetto) => {
    setProgettoInModifica(progetto);

    setForm({
      nome: progetto.nome || "",
      descrizione: progetto.descrizione || "",
      dataInizio: progetto.dataInizio || "",
      dataFine: progetto.dataFine || "",
      stato: progetto.stato || "DA_INIZIARE",
      budget: progetto.budget || "",
      clienteId: progetto.cliente?.id || "",
    });

    setModaleAperta(true);
  };

  const salvaProgetto = async (e) => {
    e.preventDefault();

    try {
      const datiDaInviare = {
        ...form,
        budget: Number(form.budget),
        clienteId: form.clienteId || null,
      };

      if (progettoInModifica) {
        const risposta = await updateProgetto(progettoInModifica.id, datiDaInviare);

        setProgetti((listaAttuale) => listaAttuale.map((progetto) => (progetto.id === progettoInModifica.id ? risposta.data : progetto)));
      } else {
        const risposta = await createProgetto(datiDaInviare);

        setProgetti((listaAttuale) => [...listaAttuale, risposta.data]);
      }

      setForm(formVuoto);
      setProgettoInModifica(null);
      setModaleAperta(false);
      setErrore("");
    } catch (error) {
      console.error(error);
      setErrore("Errore durante il salvataggio del progetto");
    }
  };

  const eliminaProgetto = async (id) => {
    const conferma = window.confirm("Vuoi eliminare questo progetto?");

    if (!conferma) return;

    try {
      await deleteProgetto(id);

      setProgetti((listaAttuale) => listaAttuale.filter((progetto) => progetto.id !== id));
    } catch (error) {
      console.error(error);
      setErrore("Errore durante l'eliminazione del progetto");
    }
  };

  const euro = (valore) =>
    Number(valore || 0).toLocaleString("it-IT", {
      style: "currency",
      currency: "EUR",
    });

  const classeStato = (stato) => {
    if (stato === "CONCLUSO") {
      return "bg-emerald-100 text-emerald-700";
    }

    if (stato === "IN_CORSO") {
      return "bg-blue-100 text-blue-700";
    }

    return "bg-orange-100 text-orange-700";
  };

  const progettiFiltrati = progetti.filter((progetto) => {
    const matchStato = filtroStato === "TUTTI" || progetto.stato === filtroStato;

    const testo = `
      ${progetto.nome || ""}
      ${progetto.descrizione || ""}
      ${progetto.stato || ""}
      ${progetto.budget || ""}
      ${progetto.cliente?.nome || ""}
    `.toLowerCase();

    const matchCerca = testo.includes(cerca.toLowerCase());

    return matchStato && matchCerca;
  });

  return (
    <main className="p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-bold text-zinc-900 md:text-3xl">Gestione Progetti</h1>

        <p className="mt-2 text-sm text-zinc-600 md:text-base">Qui puoi gestire progetti, attività interne, budget e clienti collegati.</p>

        <div className="mt-8 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col gap-3 md:flex-row">
            <input
              type="text"
              placeholder="Cerca progetto..."
              value={cerca}
              onChange={(e) => setCerca(e.target.value)}
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500 md:w-80"
            />

            <select
              value={filtroStato}
              onChange={(e) => setFiltroStato(e.target.value)}
              className="rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500"
            >
              <option value="TUTTI">Tutti</option>
              <option value="DA_INIZIARE">Da iniziare</option>
              <option value="IN_CORSO">In corso</option>
              <option value="CONCLUSO">Concluso</option>
            </select>
          </div>

          <button onClick={apriNuovoProgetto} className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-white hover:bg-emerald-400">
            + Aggiungi progetto
          </button>
        </div>

        {loading && <p className="mt-6">Caricamento progetti...</p>}

        {errore && <div className="mt-6 rounded-xl bg-red-100 p-4 text-red-700">{errore}</div>}

        {!loading && progettiFiltrati.length === 0 && <p className="mt-6 text-zinc-500">Nessun progetto trovato.</p>}

        {!loading && progettiFiltrati.length > 0 && (
          <div className="mt-8 overflow-x-auto rounded-2xl bg-white shadow">
            <table className="w-full text-left">
              <thead className="bg-zinc-900 text-white">
                <tr>
                  <th className="p-4">Nome</th>
                  <th className="p-4">Cliente</th>
                  <th className="p-4">Inizio</th>
                  <th className="p-4">Fine</th>
                  <th className="p-4">Stato</th>
                  <th className="p-4">Budget</th>
                  <th className="p-4">Azioni</th>
                </tr>
              </thead>

              <tbody>
                {progettiFiltrati.map((progetto) => (
                  <tr key={progetto.id} className="border-b hover:bg-slate-50">
                    <td className="p-4 font-semibold">{progetto.nome}</td>

                    <td className="p-4">{progetto.cliente?.nome || "Nessun cliente"}</td>

                    <td className="p-4">{progetto.dataInizio}</td>

                    <td className="p-4">{progetto.dataFine}</td>

                    <td className="p-4">
                      <span className={`rounded-full px-3 py-1 text-sm font-semibold ${classeStato(progetto.stato)}`}>{progetto.stato}</span>
                    </td>

                    <td className="p-4">{euro(progetto.budget)}</td>

                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => apriModificaProgetto(progetto)}
                          className="rounded-lg bg-blue-500 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-400"
                        >
                          Modifica
                        </button>

                        <button
                          onClick={() => eliminaProgetto(progetto.id)}
                          className="rounded-lg bg-red-500 px-3 py-2 text-sm font-semibold text-white hover:bg-red-400"
                        >
                          Elimina
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {modaleAperta && (
          <Modale titolo={progettoInModifica ? "Modifica progetto" : "Aggiungi progetto"} onClose={() => setModaleAperta(false)}>
            <form onSubmit={salvaProgetto} className="space-y-4">
              <input
                type="text"
                name="nome"
                placeholder="Nome progetto"
                value={form.nome}
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
                name="dataInizio"
                value={form.dataInizio}
                onChange={cambiaValore}
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500"
                required
              />

              <input
                type="date"
                name="dataFine"
                value={form.dataFine}
                onChange={cambiaValore}
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500"
                required
              />

              <select
                name="stato"
                value={form.stato}
                onChange={cambiaValore}
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500"
                required
              >
                <option value="DA_INIZIARE">Da iniziare</option>

                <option value="IN_CORSO">In corso</option>

                <option value="CONCLUSO">Concluso</option>
              </select>

              <input
                type="number"
                name="budget"
                placeholder="Budget"
                value={form.budget}
                onChange={cambiaValore}
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500"
                required
              />

              <select
                name="clienteId"
                value={form.clienteId}
                onChange={cambiaValore}
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500"
                required
              >
                <option value="">Seleziona cliente</option>

                {clienti.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nome}
                  </option>
                ))}
              </select>

              <button type="submit" className="w-full rounded-xl bg-emerald-500 py-3 font-semibold text-white hover:bg-emerald-400">
                {progettoInModifica ? "Salva modifiche" : "Salva progetto"}
              </button>
            </form>
          </Modale>
        )}
      </div>
    </main>
  );
}

export default Progetti;
