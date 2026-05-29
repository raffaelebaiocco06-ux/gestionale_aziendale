import { useEffect, useState } from "react";
import { getClienti, createCliente, updateCliente, deleteCliente } from "../js/clienti";
import Modale from "../Components/Modale";

function Clienti() {
  const [clienti, setClienti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState("");
  const [cerca, setCerca] = useState("");
  const [modaleAperta, setModaleAperta] = useState(false);
  const [clienteInModifica, setClienteInModifica] = useState(null);

  const formVuoto = {
    nome: "",
    partitaIva: "",
    codiceFiscale: "",
    telefono: "",
    email: "",
    indirizzo: "",
    citta: "",
  };

  const [form, setForm] = useState(formVuoto);

  useEffect(() => {
    const caricaClienti = async () => {
      try {
        setLoading(true);
        const risposta = await getClienti();
        setClienti(risposta.data.content || risposta.data);
      } catch (error) {
        console.error(error);
        setErrore("Errore durante il caricamento dei clienti");
      } finally {
        setLoading(false);
      }
    };
    caricaClienti();
  }, []);

  const cambiaValore = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const apriNuovoCliente = () => {
    setClienteInModifica(null);
    setForm(formVuoto);
    setModaleAperta(true);
  };

  const apriModificaCliente = (cliente) => {
    setClienteInModifica(cliente);

    setForm({
      nome: cliente.nome || "",
      partitaIva: cliente.partitaIva || "",
      codiceFiscale: cliente.codiceFiscale || "",
      telefono: cliente.telefono || "",
      email: cliente.email || "",
      indirizzo: cliente.indirizzo || "",
      citta: cliente.citta || "",
    });

    setModaleAperta(true);
  };

  const salvaCliente = async (e) => {
    e.preventDefault();

    try {
      if (clienteInModifica) {
        const risposta = await updateCliente(clienteInModifica.id, form);

        setClienti((listaAttuale) => listaAttuale.map((cliente) => (cliente.id === clienteInModifica.id ? risposta.data : cliente)));
      } else {
        const risposta = await createCliente(form);
        setClienti((listaAttuale) => [...listaAttuale, risposta.data]);
      }

      setForm(formVuoto);
      setClienteInModifica(null);
      setModaleAperta(false);
      setErrore("");
    } catch (error) {
      console.error(error);
      setErrore("Errore durante il salvataggio del cliente");
    }
  };

  const eliminaCliente = async (id) => {
    const conferma = window.confirm("Vuoi eliminare questo cliente?");
    if (!conferma) return;

    try {
      await deleteCliente(id);

      setClienti((listaAttuale) => listaAttuale.filter((cliente) => cliente.id !== id));
    } catch (error) {
      console.error(error);
      setErrore("Errore durante l'eliminazione del cliente");
    }
  };

  const clientiFiltrati = clienti.filter((cliente) => {
    const testo = `
      ${cliente.nome || ""}
      ${cliente.partitaIva || ""}
      ${cliente.codiceFiscale || ""}
      ${cliente.telefono || ""}
      ${cliente.email || ""}
      ${cliente.indirizzo || ""}
      ${cliente.citta || ""}
    `.toLowerCase();

    return testo.includes(cerca.toLowerCase());
  });

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-zinc-900">Gestione Clienti</h1>

        <p className="mt-2 text-zinc-600">Qui puoi gestire l’anagrafica dei clienti aziendali.</p>

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <input
            type="text"
            placeholder="Cerca cliente..."
            value={cerca}
            onChange={(e) => setCerca(e.target.value)}
            className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500 md:max-w-sm"
          />

          <button onClick={apriNuovoCliente} className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-white hover:bg-emerald-400">
            + Aggiungi cliente
          </button>
        </div>

        {loading && <p className="mt-6">Caricamento clienti...</p>}

        {errore && <div className="mt-6 rounded-xl bg-red-100 p-4 text-red-700">{errore}</div>}

        {!loading && clientiFiltrati.length === 0 && <p className="mt-6 text-zinc-500">Nessun cliente trovato.</p>}

        {!loading && clientiFiltrati.length > 0 && (
          <div className="mt-8 overflow-x-auto rounded-2xl bg-white shadow">
            <table className="w-full text-left">
              <thead className="bg-zinc-900 text-white">
                <tr>
                  <th className="p-4">Nome</th>
                  <th className="p-4">Partita IVA</th>
                  <th className="p-4">Codice fiscale</th>
                  <th className="p-4">Telefono</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Città</th>
                  <th className="p-4">Azioni</th>
                </tr>
              </thead>

              <tbody>
                {clientiFiltrati.map((cliente) => (
                  <tr key={cliente.id} className="border-b hover:bg-slate-50">
                    <td className="p-4 font-semibold">{cliente.nome}</td>
                    <td className="p-4">{cliente.partitaIva}</td>
                    <td className="p-4">{cliente.codiceFiscale}</td>
                    <td className="p-4">{cliente.telefono}</td>
                    <td className="p-4">{cliente.email}</td>
                    <td className="p-4">{cliente.citta}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => apriModificaCliente(cliente)}
                          className="rounded-lg bg-blue-500 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-400"
                        >
                          Modifica
                        </button>

                        <button
                          onClick={() => eliminaCliente(cliente.id)}
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
          <Modale titolo={clienteInModifica ? "Modifica cliente" : "Aggiungi cliente"} onClose={() => setModaleAperta(false)}>
            <form onSubmit={salvaCliente} className="space-y-4">
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
                name="codiceFiscale"
                placeholder="Codice fiscale"
                value={form.codiceFiscale}
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
                name="citta"
                placeholder="Città"
                value={form.citta}
                onChange={cambiaValore}
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500"
                required
              />

              <button type="submit" className="w-full rounded-xl bg-emerald-500 py-3 font-semibold text-white hover:bg-emerald-400">
                {clienteInModifica ? "Salva modifiche" : "Salva cliente"}
              </button>
            </form>
          </Modale>
        )}
      </div>
    </main>
  );
}

export default Clienti;
