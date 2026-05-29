import { useEffect, useState } from "react";
import { getFornitori, createFornitore, updateFornitore, deleteFornitore } from "../js/fornitore";
import Modale from "../Components/Modale";

function Fornitori() {
  const [fornitori, setFornitori] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState("");
  const [cerca, setCerca] = useState("");
  const [modaleAperta, setModaleAperta] = useState(false);
  const [fornitoreInModifica, setFornitoreInModifica] = useState(null);

  const formVuoto = {
    nome: "",
    partitaIva: "",
    telefono: "",
    email: "",
    indirizzo: "",
    categoria: "",
  };

  const [form, setForm] = useState(formVuoto);

  useEffect(() => {
    const caricaFornitori = async () => {
      try {
        setLoading(true);
        const risposta = await getFornitori();
        setFornitori(risposta.data.content || risposta.data);
      } catch (error) {
        console.error(error);
        setErrore("Errore durante il caricamento dei fornitori");
      } finally {
        setLoading(false);
      }
    };
    caricaFornitori();
  }, []);

  const cambiaValore = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const apriNuovoFornitore = () => {
    setFornitoreInModifica(null);
    setForm(formVuoto);
    setModaleAperta(true);
  };

  const apriModificaFornitore = (fornitore) => {
    setFornitoreInModifica(fornitore);

    setForm({
      nome: fornitore.nome || "",
      partitaIva: fornitore.partitaIva || "",
      telefono: fornitore.telefono || "",
      email: fornitore.email || "",
      indirizzo: fornitore.indirizzo || "",
      categoria: fornitore.categoria || "",
    });

    setModaleAperta(true);
  };

  const salvaFornitore = async (e) => {
    e.preventDefault();

    try {
      const datiDaInviare = {
        nome: form.nome,
        partitaIva: form.partitaIva,
        telefono: form.telefono,
        email: form.email,
        indirizzo: form.indirizzo,
        categoria: form.categoria,
      };

      if (fornitoreInModifica) {
        const risposta = await updateFornitore(fornitoreInModifica.id, datiDaInviare);

        setFornitori((listaAttuale) => listaAttuale.map((fornitore) => (fornitore.id === fornitoreInModifica.id ? risposta.data : fornitore)));
      } else {
        const risposta = await createFornitore(datiDaInviare);
        setFornitori((listaAttuale) => [...listaAttuale, risposta.data]);
      }

      setForm(formVuoto);
      setFornitoreInModifica(null);
      setModaleAperta(false);
      setErrore("");
    } catch (error) {
      console.error(error);
      setErrore("Errore durante il salvataggio del fornitore");
    }
  };

  const eliminaFornitore = async (id) => {
    const conferma = window.confirm("Vuoi eliminare questo fornitore?");
    if (!conferma) return;

    try {
      await deleteFornitore(id);

      setFornitori((listaAttuale) => listaAttuale.filter((fornitore) => fornitore.id !== id));
    } catch (error) {
      console.error(error);
      setErrore("Errore durante l'eliminazione del fornitore");
    }
  };

  const fornitoriFiltrati = fornitori.filter((fornitore) => {
    const testo = `
      ${fornitore.nome || ""}
      ${fornitore.partitaIva || ""}
      ${fornitore.telefono || ""}
      ${fornitore.email || ""}
      ${fornitore.indirizzo || ""}
      ${fornitore.categoria || ""}
    `.toLowerCase();

    return testo.includes(cerca.toLowerCase());
  });

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-zinc-900">Gestione Fornitori</h1>

        <p className="mt-2 text-zinc-600">Qui puoi gestire l’anagrafica dei fornitori aziendali.</p>

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <input
            type="text"
            placeholder="Cerca fornitore..."
            value={cerca}
            onChange={(e) => setCerca(e.target.value)}
            className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500 md:max-w-sm"
          />

          <button onClick={apriNuovoFornitore} className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-white hover:bg-emerald-400">
            + Aggiungi fornitore
          </button>
        </div>

        {loading && <p className="mt-6">Caricamento fornitori...</p>}

        {errore && <div className="mt-6 rounded-xl bg-red-100 p-4 text-red-700">{errore}</div>}

        {!loading && fornitoriFiltrati.length === 0 && <p className="mt-6 text-zinc-500">Nessun fornitore trovato.</p>}

        {!loading && fornitoriFiltrati.length > 0 && (
          <div className="mt-8 overflow-x-auto rounded-2xl bg-white shadow">
            <table className="w-full text-left">
              <thead className="bg-zinc-900 text-white">
                <tr>
                  <th className="p-4">Nome</th>
                  <th className="p-4">Partita IVA</th>
                  <th className="p-4">Telefono</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Indirizzo</th>
                  <th className="p-4">Categoria</th>
                  <th className="p-4">Azioni</th>
                </tr>
              </thead>

              <tbody>
                {fornitoriFiltrati.map((fornitore) => (
                  <tr key={fornitore.id} className="border-b hover:bg-slate-50">
                    <td className="p-4 font-semibold">{fornitore.nome}</td>
                    <td className="p-4">{fornitore.partitaIva}</td>
                    <td className="p-4">{fornitore.telefono}</td>
                    <td className="p-4">{fornitore.email}</td>
                    <td className="p-4">{fornitore.indirizzo}</td>
                    <td className="p-4">{fornitore.categoria}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => apriModificaFornitore(fornitore)}
                          className="rounded-lg bg-blue-500 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-400"
                        >
                          Modifica
                        </button>

                        <button
                          onClick={() => eliminaFornitore(fornitore.id)}
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
          <Modale titolo={fornitoreInModifica ? "Modifica fornitore" : "Aggiungi fornitore"} onClose={() => setModaleAperta(false)}>
            <form onSubmit={salvaFornitore} className="space-y-4">
              <input
                type="text"
                name="nome"
                placeholder="Nome"
                value={form.nome}
                onChange={cambiaValore}
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500"
                required
              />

              <input
                type="text"
                name="partitaIva"
                placeholder="Partita IVA"
                value={form.partitaIva}
                onChange={cambiaValore}
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500"
                required
              />

              <input
                type="text"
                name="telefono"
                placeholder="Telefono"
                value={form.telefono}
                onChange={cambiaValore}
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500"
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={cambiaValore}
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500"
                required
              />

              <input
                type="text"
                name="indirizzo"
                placeholder="Indirizzo"
                value={form.indirizzo}
                onChange={cambiaValore}
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500"
                required
              />

              <input
                type="text"
                name="categoria"
                placeholder="Categoria es. Materiali, Servizi, Trasporti..."
                value={form.categoria}
                onChange={cambiaValore}
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500"
                required
              />

              <button type="submit" className="w-full rounded-xl bg-emerald-500 py-3 font-semibold text-white hover:bg-emerald-400">
                {fornitoreInModifica ? "Salva modifiche" : "Salva fornitore"}
              </button>
            </form>
          </Modale>
        )}
      </div>
    </main>
  );
}

export default Fornitori;
