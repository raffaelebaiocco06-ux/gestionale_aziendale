import { useEffect, useState } from "react";
import { createMovimento, getMovimenti, deleteMovimento } from "../js/movimenti";
import { getCategorie } from "../js/categorie";
import Modale from "../Components/Modale";

function Movimenti() {
  const [movimenti, setMovimenti] = useState([]);
  const [categorie, setCategorie] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState("");
  const [cerca, setCerca] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("TUTTI");
  const [modaleAperta, setModaleAperta] = useState(false);

  const [form, setForm] = useState({
    categoriaId: "",
    tipo: "ENTRATA",
    descrizione: "",
    importo: "",
    dataMovimento: "",
    metodoPagamento: "CONTANTI",
    stato: "PAGATO",
  });

  useEffect(() => {
    const caricaDati = async () => {
      try {
        setLoading(true);

        const [rispostaMovimenti, rispostaCategorie] = await Promise.all([getMovimenti(), getCategorie()]);

        setMovimenti(rispostaMovimenti.data.content || rispostaMovimenti.data);
        setCategorie(rispostaCategorie.data.content || rispostaCategorie.data);
      } catch (error) {
        console.error(error);
        setErrore("Errore durante il caricamento dei movimenti");
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

  const salvaMovimento = async (e) => {
    e.preventDefault();

    try {
      const datiDaInviare = {
        ...form,
        importo: Number(form.importo),
      };

      const risposta = await createMovimento(datiDaInviare);

      setMovimenti((listaAttuale) => [...listaAttuale, risposta.data]);

      setForm({
        categoriaId: "",
        tipo: "ENTRATA",
        descrizione: "",
        importo: "",
        dataMovimento: "",
        metodoPagamento: "CONTANTI",
        stato: "PAGATO",
      });

      setModaleAperta(false);
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

      setMovimenti((listaAttuale) => listaAttuale.filter((movimento) => movimento.id !== id));
    } catch (error) {
      console.error(error);
      setErrore("Errore durante l'eliminazione del movimento");
    }
  };

  const categorieFiltrate = categorie.filter((categoria) => categoria.tipo === form.tipo);

  const movimentiFiltrati = movimenti.filter((movimento) => {
    const matchTipo = filtroTipo === "TUTTI" || movimento.tipo === filtroTipo;

    const testo = `
      ${movimento.descrizione || ""}
      ${movimento.categoria?.nome || ""}
      ${movimento.metodoPagamento || ""}
      ${movimento.stato || ""}
    `.toLowerCase();

    const matchCerca = testo.includes(cerca.toLowerCase());

    return matchTipo && matchCerca;
  });

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-zinc-900">Gestione Movimenti</h1>

        <p className="mt-2 text-zinc-600">Qui puoi gestire entrate e uscite aziendali.</p>

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3 md:flex-row">
            <input
              type="text"
              placeholder="Cerca movimento..."
              value={cerca}
              onChange={(e) => setCerca(e.target.value)}
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500 md:w-80"
            />

            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500"
            >
              <option value="TUTTI">Tutti</option>
              <option value="ENTRATA">Entrate</option>
              <option value="USCITA">Uscite</option>
            </select>
          </div>

          <button onClick={() => setModaleAperta(true)} className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-white hover:bg-emerald-400">
            + Aggiungi movimento
          </button>
        </div>

        {loading && <p className="mt-6">Caricamento movimenti...</p>}

        {errore && <div className="mt-6 rounded-xl bg-red-100 p-4 text-red-700">{errore}</div>}

        {!loading && movimentiFiltrati.length === 0 && <p className="mt-6 text-zinc-500">Nessun movimento trovato.</p>}

        {!loading && movimentiFiltrati.length > 0 && (
          <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow">
            <table className="w-full text-left">
              <thead className="bg-zinc-900 text-white">
                <tr>
                  <th className="p-4">Tipo</th>
                  <th className="p-4">Descrizione</th>
                  <th className="p-4">Categoria</th>
                  <th className="p-4">Importo</th>
                  <th className="p-4">Data</th>
                  <th className="p-4">Pagamento</th>
                  <th className="p-4">Stato</th>
                </tr>
              </thead>

              <tbody>
                {movimentiFiltrati.map((movimento) => (
                  <tr key={movimento.id} className="border-b hover:bg-slate-50">
                    <td className="p-4 font-semibold">{movimento.tipo}</td>
                    <td className="p-4">{movimento.descrizione}</td>
                    <td className="p-4">{movimento.categoria?.nome}</td>
                    <td className="p-4">€ {movimento.importo}</td>
                    <td className="p-4">{movimento.dataMovimento}</td>
                    <td className="p-4">{movimento.metodoPagamento}</td>
                    <td className="p-4">{movimento.stato}</td>
                    <td className="p-4">
                      <button
                        onClick={() => eliminaMovimento(movimento.id)}
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
          <Modale titolo="Aggiungi movimento" onClose={() => setModaleAperta(false)}>
            <form onSubmit={salvaMovimento} className="space-y-4">
              <select
                name="tipo"
                value={form.tipo}
                onChange={cambiaValore}
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500"
                required
              >
                <option value="ENTRATA">Entrata</option>
                <option value="USCITA">Uscita</option>
              </select>

              <input
                type="text"
                name="descrizione"
                placeholder="Descrizione"
                value={form.descrizione}
                onChange={cambiaValore}
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500"
                required
              />

              <input
                type="number"
                name="importo"
                placeholder="Importo"
                value={form.importo}
                onChange={cambiaValore}
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500"
                required
              />

              <input
                type="date"
                name="dataMovimento"
                value={form.dataMovimento}
                onChange={cambiaValore}
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500"
                required
              />

              <select
                name="categoriaId"
                value={form.categoriaId}
                onChange={cambiaValore}
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500"
                required
              >
                <option value="">Seleziona categoria</option>
                {categorieFiltrate.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nome}
                  </option>
                ))}
              </select>

              <select
                name="metodoPagamento"
                value={form.metodoPagamento}
                onChange={cambiaValore}
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500"
                required
              >
                <option value="CONTANTI">Contanti</option>
                <option value="CARTA">Carta</option>
                <option value="BONIFICO">Bonifico</option>
              </select>

              <select
                name="stato"
                value={form.stato}
                onChange={cambiaValore}
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500"
                required
              >
                <option value="PAGATO">Pagato</option>
                <option value="DA_PAGARE">Da pagare</option>
              </select>

              <button type="submit" className="w-full rounded-xl bg-emerald-500 py-3 font-semibold text-white hover:bg-emerald-400">
                Salva movimento
              </button>
            </form>
          </Modale>
        )}
      </div>
    </main>
  );
}

export default Movimenti;
