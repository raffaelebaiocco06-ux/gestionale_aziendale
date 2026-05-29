import { useEffect, useState } from "react";
import { getMovimenti, createMovimento, updateMovimento, deleteMovimento } from "../js/movimenti";
import { getClienti } from "../js/clienti";
import { getFornitori } from "../js/fornitore";
import { getMezzi } from "../js/mezzi";
import Modale from "../Components/Modale";

function Movimenti() {
  const [movimenti, setMovimenti] = useState([]);
  const [clienti, setClienti] = useState([]);
  const [fornitori, setFornitori] = useState([]);
  const [mezzi, setMezzi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState("");
  const [cerca, setCerca] = useState("");
  const [modaleAperta, setModaleAperta] = useState(false);
  const [movimentoInModifica, setMovimentoInModifica] = useState(null);

  const formVuoto = {
    tipo: "ENTRATA",
    categoria: "",
    descrizione: "",
    importo: "",
    dataMovimento: "",
    metodoPagamento: "BONIFICO",
    stato: "DA_PAGARE",
    clienteId: "",
    fornitoreId: "",
    mezzoId: "",
  };

  const [form, setForm] = useState(formVuoto);

  const normalizza = (data) => data?.content || data || [];

  useEffect(() => {
    const caricaDati = async () => {
      try {
        setLoading(true);

        const [rispostaMovimenti, rispostaClienti, rispostaFornitori, rispostaMezzi] = await Promise.all([
          getMovimenti(),
          getClienti(),
          getFornitori(),
          getMezzi(),
        ]);

        setMovimenti(normalizza(rispostaMovimenti.data));
        setClienti(normalizza(rispostaClienti.data));
        setFornitori(normalizza(rispostaFornitori.data));
        setMezzi(normalizza(rispostaMezzi.data));
      } catch (error) {
        console.error(error);
        setErrore("Errore durante il caricamento dei dati");
      } finally {
        setLoading(false);
      }
    };

    caricaDati();
  }, []);

  const cambiaValore = (e) => {
    const { name, value } = e.target;

    if (name === "tipo") {
      setForm({
        ...form,
        tipo: value,
        clienteId: value === "ENTRATA" ? form.clienteId : "",
        fornitoreId: value === "USCITA" ? form.fornitoreId : "",
      });
      return;
    }

    setForm({
      ...form,
      [name]: value,
    });
  };

  const apriNuovoMovimento = () => {
    setMovimentoInModifica(null);
    setForm(formVuoto);
    setModaleAperta(true);
  };

  const apriModificaMovimento = (movimento) => {
    setMovimentoInModifica(movimento);

    setForm({
      tipo: movimento.tipo || "ENTRATA",
      categoria: movimento.categoria || "",
      descrizione: movimento.descrizione || "",
      importo: movimento.importo || "",
      dataMovimento: movimento.dataMovimento || "",
      metodoPagamento: movimento.metodoPagamento || "BONIFICO",
      stato: movimento.stato || "DA_PAGARE",
      clienteId: movimento.cliente?.id || "",
      fornitoreId: movimento.fornitore?.id || "",
      mezzoId: movimento.mezzo?.id || "",
    });

    setModaleAperta(true);
  };

  const salvaMovimento = async (e) => {
    e.preventDefault();

    if (!form.categoria.trim()) {
      setErrore("Devi inserire una categoria");
      return;
    }

    try {
      const datiDaInviare = {
        tipo: form.tipo,
        categoria: form.categoria,
        descrizione: form.descrizione,
        importo: Number(form.importo),
        dataMovimento: form.dataMovimento,
        metodoPagamento: form.metodoPagamento,
        stato: form.stato,
        clienteId: form.clienteId || null,
        fornitoreId: form.fornitoreId || null,
        mezzoId: form.mezzoId || null,
      };

      if (movimentoInModifica) {
        const risposta = await updateMovimento(movimentoInModifica.id, datiDaInviare);

        setMovimenti((lista) => lista.map((movimento) => (movimento.id === movimentoInModifica.id ? risposta.data : movimento)));
      } else {
        const risposta = await createMovimento(datiDaInviare);
        setMovimenti((lista) => [...lista, risposta.data]);
      }

      setForm(formVuoto);
      setMovimentoInModifica(null);
      setModaleAperta(false);
      setErrore("");
    } catch (error) {
      console.error(error);
      setErrore("Errore durante il salvataggio del movimento");
    }
  };

  const eliminaMovimento = async (id) => {
    const conferma = window.confirm("Vuoi eliminare questo movimento?");
    if (!conferma) return;

    try {
      await deleteMovimento(id);
      setMovimenti((lista) => lista.filter((movimento) => movimento.id !== id));
    } catch (error) {
      console.error(error);
      setErrore("Errore durante l'eliminazione del movimento");
    }
  };

  const euro = (valore) =>
    Number(valore || 0).toLocaleString("it-IT", {
      style: "currency",
      currency: "EUR",
    });

  const movimentiFiltrati = movimenti.filter((movimento) => {
    const testo = `
      ${movimento.tipo || ""}
      ${movimento.categoria || ""}
      ${movimento.descrizione || ""}
      ${movimento.importo || ""}
      ${movimento.dataMovimento || ""}
      ${movimento.metodoPagamento || ""}
      ${movimento.stato || ""}
      ${movimento.cliente?.nome || ""}
      ${movimento.fornitore?.nome || ""}
      ${movimento.mezzo?.targa || ""}
    `.toLowerCase();

    return testo.includes(cerca.toLowerCase());
  });

  return (
    <main className="p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-bold text-zinc-900 md:text-3xl">Gestione Movimenti</h1>

        <p className="mt-2 text-sm text-zinc-600 md:text-base">Registra entrate e uscite aziendali.</p>

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <input
            type="text"
            placeholder="Cerca movimento..."
            value={cerca}
            onChange={(e) => setCerca(e.target.value)}
            className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500 md:max-w-sm"
          />

          <button onClick={apriNuovoMovimento} className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-white hover:bg-emerald-400">
            + Aggiungi movimento
          </button>
        </div>

        {loading && <p className="mt-6">Caricamento movimenti...</p>}

        {errore && <div className="mt-6 rounded-xl bg-red-100 p-4 text-red-700">{errore}</div>}

        {!loading && movimentiFiltrati.length === 0 && <p className="mt-6 text-zinc-500">Nessun movimento trovato.</p>}

        {!loading && movimentiFiltrati.length > 0 && (
          <div className="mt-8 overflow-x-auto rounded-2xl bg-white shadow">
            <table className="w-full text-left">
              <thead className="bg-zinc-900 text-white">
                <tr>
                  <th className="p-4">Tipo</th>
                  <th className="p-4">Categoria</th>
                  <th className="p-4">Descrizione</th>
                  <th className="p-4">Importo</th>
                  <th className="p-4">Data</th>
                  <th className="p-4">Pagamento</th>
                  <th className="p-4">Stato</th>
                  <th className="p-4">Azioni</th>
                </tr>
              </thead>

              <tbody>
                {movimentiFiltrati.map((movimento) => (
                  <tr key={movimento.id} className="border-b hover:bg-slate-50">
                    <td className="p-4 font-semibold">{movimento.tipo}</td>
                    <td className="p-4">{movimento.categoria || "-"}</td>
                    <td className="p-4">{movimento.descrizione}</td>
                    <td className={`p-4 font-semibold ${movimento.tipo === "ENTRATA" ? "text-emerald-600" : "text-red-600"}`}>{euro(movimento.importo)}</td>
                    <td className="p-4">{movimento.dataMovimento}</td>
                    <td className="p-4">{movimento.metodoPagamento}</td>
                    <td className="p-4">{movimento.stato}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => apriModificaMovimento(movimento)}
                          className="rounded-lg bg-blue-500 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-400"
                        >
                          Modifica
                        </button>

                        <button
                          onClick={() => eliminaMovimento(movimento.id)}
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
          <Modale titolo={movimentoInModifica ? "Modifica movimento" : "Aggiungi movimento"} onClose={() => setModaleAperta(false)}>
            <form onSubmit={salvaMovimento} className="space-y-4">
              <select name="tipo" value={form.tipo} onChange={cambiaValore} className="w-full rounded-xl border border-zinc-300 px-4 py-3" required>
                <option value="ENTRATA">Entrata</option>
                <option value="USCITA">Uscita</option>
              </select>

              <input
                type="text"
                name="categoria"
                placeholder="Categoria es. Acconto, Carburante, Affitto..."
                value={form.categoria}
                onChange={cambiaValore}
                className="w-full rounded-xl border border-zinc-300 px-4 py-3"
                required
              />

              <input
                type="text"
                name="descrizione"
                placeholder="Descrizione"
                value={form.descrizione}
                onChange={cambiaValore}
                className="w-full rounded-xl border border-zinc-300 px-4 py-3"
                required
              />

              <input
                type="number"
                name="importo"
                placeholder="Importo"
                value={form.importo}
                onChange={cambiaValore}
                className="w-full rounded-xl border border-zinc-300 px-4 py-3"
                required
              />

              <input
                type="date"
                name="dataMovimento"
                value={form.dataMovimento}
                onChange={cambiaValore}
                className="w-full rounded-xl border border-zinc-300 px-4 py-3"
                required
              />

              <select
                name="metodoPagamento"
                value={form.metodoPagamento}
                onChange={cambiaValore}
                className="w-full rounded-xl border border-zinc-300 px-4 py-3"
                required
              >
                <option value="CONTANTI">Contanti</option>
                <option value="BONIFICO">Bonifico</option>
                <option value="CARTA">Carta</option>
                <option value="ASSEGNO">Assegno</option>
              </select>

              <select name="stato" value={form.stato} onChange={cambiaValore} className="w-full rounded-xl border border-zinc-300 px-4 py-3" required>
                <option value="PAGATO">Pagato</option>
                <option value="DA_PAGARE">Da pagare</option>
                <option value="SCADUTO">Scaduto</option>
              </select>

              {form.tipo === "ENTRATA" && (
                <select name="clienteId" value={form.clienteId} onChange={cambiaValore} className="w-full rounded-xl border border-zinc-300 px-4 py-3">
                  <option value="">Nessun cliente collegato</option>
                  {clienti.map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nome}
                    </option>
                  ))}
                </select>
              )}

              {form.tipo === "USCITA" && (
                <select name="fornitoreId" value={form.fornitoreId} onChange={cambiaValore} className="w-full rounded-xl border border-zinc-300 px-4 py-3">
                  <option value="">Nessun fornitore collegato</option>
                  {fornitori.map((fornitore) => (
                    <option key={fornitore.id} value={fornitore.id}>
                      {fornitore.nome}
                    </option>
                  ))}
                </select>
              )}

              <select name="mezzoId" value={form.mezzoId} onChange={cambiaValore} className="w-full rounded-xl border border-zinc-300 px-4 py-3">
                <option value="">Nessun mezzo collegato</option>
                {mezzi.map((mezzo) => (
                  <option key={mezzo.id} value={mezzo.id}>
                    {mezzo.targa} - {mezzo.marca} {mezzo.modello}
                  </option>
                ))}
              </select>

              <button type="submit" className="w-full rounded-xl bg-emerald-500 py-3 font-semibold text-white hover:bg-emerald-400">
                {movimentoInModifica ? "Salva modifiche" : "Salva movimento"}
              </button>
            </form>
          </Modale>
        )}
      </div>
    </main>
  );
}

export default Movimenti;
