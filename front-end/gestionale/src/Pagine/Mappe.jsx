import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Rect, Text, Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import { getMappe, uploadMappa, getElementiMappa, createElementoMappa, updateElementoMappa, deleteElementoMappa } from "../js/mappe";

function ImmagineSfondo({ src, width, height }) {
  const [image] = useImage(src);
  return <KonvaImage image={image} width={width} height={height} />;
}

function Mappe() {
  const [mappe, setMappe] = useState([]);
  const [mappaSelezionata, setMappaSelezionata] = useState(null);
  const [elementi, setElementi] = useState([]);
  const [file, setFile] = useState(null);
  const [nomeMappa, setNomeMappa] = useState("");
  const [elementoSelezionato, setElementoSelezionato] = useState(null);
  const [errore, setErrore] = useState("");

  const stageWidth = 1000;
  const stageHeight = 700;
  const fileInputRef = useRef(null);

  const normalizzaLista = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.content)) return data.content;
    return [];
  };

  useEffect(() => {
    const caricaMappe = async () => {
      try {
        const risposta = await getMappe();
        setMappe(normalizzaLista(risposta.data));
      } catch (error) {
        console.error(error);
        setErrore("Errore durante il caricamento delle mappe");
      }
    };
    caricaMappe();
  }, []);

  const selezionaMappa = async (mappa) => {
    try {
      setMappaSelezionata(mappa);
      setElementoSelezionato(null);

      const risposta = await getElementiMappa(mappa.id);
      setElementi(normalizzaLista(risposta.data));
    } catch (error) {
      console.error(error);
      setErrore("Errore durante il caricamento degli elementi");
    }
  };

  const caricaNuovaMappa = async (e) => {
    e.preventDefault();

    if (!file || !nomeMappa) {
      setErrore("Inserisci nome e file della mappa");
      return;
    }

    const img = new Image();

    img.onload = async () => {
      try {
        const formData = new FormData();
        formData.append("nome", nomeMappa);
        formData.append("file", file);
        formData.append("larghezzaOriginale", img.width);
        formData.append("altezzaOriginale", img.height);

        const risposta = await uploadMappa(formData);

        setMappe((lista) => [...lista, risposta.data]);
        setNomeMappa("");
        setFile(null);
        setErrore("");

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        selezionaMappa(risposta.data);
      } catch (error) {
        console.error(error);
        setErrore("Errore durante l'upload della mappa");
      }
    };

    img.src = URL.createObjectURL(file);
  };

  const aggiungiElemento = async (tipo = "TAVOLO") => {
    if (!mappaSelezionata) return;

    const configurazioni = {
      TAVOLO: {
        nome: "Tavolo " + (elementi.length + 1),
        larghezza: 120,
        altezza: 60,
        colore: "#22c55e",
        stato: "LIBERO",
      },
      STAND: {
        nome: "Stand " + (elementi.length + 1),
        larghezza: 160,
        altezza: 100,
        colore: "#22c55e",
        stato: "LIBERO",
      },
      CORRIDOIO: {
        nome: "Corridoio " + (elementi.length + 1),
        larghezza: 220,
        altezza: 40,
        colore: "#ef4444",
        stato: "NON_DISPONIBILE",
      },
      AREA_SERVIZI: {
        nome: "Area servizi " + (elementi.length + 1),
        larghezza: 150,
        altezza: 100,
        colore: "#a855f7",
        stato: "RISERVATO",
      },
      INGRESSO: {
        nome: "Ingresso " + (elementi.length + 1),
        larghezza: 140,
        altezza: 70,
        colore: "#a855f7",
        stato: "RISERVATO",
      },
    };

    const config = configurazioni[tipo];

    const nuovoElemento = {
      nome: config.nome,
      tipo,
      x: 80,
      y: 80,
      larghezza: config.larghezza,
      altezza: config.altezza,
      colore: config.colore,
      stato: config.stato,
    };

    try {
      const risposta = await createElementoMappa(mappaSelezionata.id, nuovoElemento);

      setElementi((lista) => [...lista, risposta.data]);
      setElementoSelezionato(risposta.data);
      setErrore("");
    } catch (error) {
      console.error(error);
      setErrore("Errore durante la creazione dell'elemento");
    }
  };

  const aggiornaElemento = async (elementoAggiornato) => {
    try {
      const data = {
        nome: elementoAggiornato.nome,
        tipo: elementoAggiornato.tipo,
        x: elementoAggiornato.x,
        y: elementoAggiornato.y,
        larghezza: elementoAggiornato.larghezza,
        altezza: elementoAggiornato.altezza,
        colore: elementoAggiornato.colore,
        stato: elementoAggiornato.stato,
      };

      const risposta = await updateElementoMappa(elementoAggiornato.id, data);

      setElementi((lista) => lista.map((el) => (el.id === elementoAggiornato.id ? risposta.data : el)));

      setElementoSelezionato(risposta.data);
      setErrore("");
    } catch (error) {
      console.error(error);
      setErrore("Errore durante il salvataggio dell'elemento");
    }
  };

  const eliminaElemento = async () => {
    if (!elementoSelezionato) return;

    const conferma = window.confirm("Vuoi eliminare questo elemento?");
    if (!conferma) return;

    try {
      await deleteElementoMappa(elementoSelezionato.id);

      setElementi((lista) => lista.filter((el) => el.id !== elementoSelezionato.id));

      setElementoSelezionato(null);
      setErrore("");
    } catch (error) {
      console.error(error);
      setErrore("Errore durante l'eliminazione dell'elemento");
    }
  };

  const cambiaCampoElemento = (campo, valore) => {
    if (!elementoSelezionato) return;

    const aggiornato = {
      ...elementoSelezionato,
      [campo]: valore,
    };

    setElementoSelezionato(aggiornato);

    setElementi((lista) => lista.map((el) => (el.id === aggiornato.id ? aggiornato : el)));
  };

  const salvaElementoSelezionato = () => {
    if (elementoSelezionato) {
      aggiornaElemento(elementoSelezionato);
    }
  };

  const getColoreDaStato = (stato) => {
    if (stato === "LIBERO") return "#22c55e";
    if (stato === "PRENOTATO") return "#facc15";
    if (stato === "PAGATO") return "#3b82f6";
    if (stato === "RISERVATO") return "#a855f7";
    return "#ef4444";
  };

  const getFileUrl = (fileUrl) => {
    if (!fileUrl) return "";
    if (fileUrl.startsWith("http")) return fileUrl;
    return `http://localhost:3001${fileUrl}`;
  };

  return (
    <main className="p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-bold text-zinc-900 md:text-3xl">Mappe Fiera</h1>

        <p className="mt-2 text-sm text-zinc-600 md:text-base">Carica una piantina fieristica e gestisci tavoli, stand ed espositori.</p>
        <p className="mt-2 text-sm text-zinc-600 md:text-base">Inserire solo PNG o JPG o WebP </p>

        {errore && <div className="mt-6 rounded-xl bg-red-100 p-4 text-red-700">{errore}</div>}

        <form onSubmit={caricaNuovaMappa} className="mt-8 grid gap-4 rounded-2xl bg-white p-5 shadow md:grid-cols-3">
          <input
            type="text"
            placeholder="Nome mappa"
            value={nomeMappa}
            onChange={(e) => setNomeMappa(e.target.value)}
            className="rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500"
          />

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="rounded-xl border border-zinc-300 px-4 py-3"
          />

          <button className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-white hover:bg-emerald-400">Carica mappa</button>
        </form>

        <div className="mt-8 grid gap-6 xl:grid-cols-[280px_1fr_300px]">
          <aside className="rounded-2xl bg-white p-5 shadow">
            <h2 className="font-bold text-zinc-900">Mappe disponibili</h2>

            <div className="mt-4 space-y-2">
              {mappe.length === 0 && <p className="text-sm text-zinc-500">Nessuna mappa caricata.</p>}

              {mappe.map((mappa) => (
                <button
                  key={mappa.id}
                  onClick={() => selezionaMappa(mappa)}
                  className={`w-full rounded-xl px-4 py-3 text-left font-semibold ${
                    mappaSelezionata?.id === mappa.id ? "bg-emerald-500 text-white" : "bg-slate-100 text-zinc-700 hover:bg-slate-200"
                  }`}
                >
                  {mappa.nome}
                </button>
              ))}
            </div>
          </aside>

          <section className="overflow-auto rounded-2xl bg-white p-5 shadow">
            <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <h2 className="font-bold text-zinc-900">{mappaSelezionata ? mappaSelezionata.nome : "Nessuna mappa selezionata"}</h2>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => aggiungiElemento("TAVOLO")}
                  disabled={!mappaSelezionata}
                  className="rounded-xl bg-emerald-500 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-400 disabled:opacity-40"
                >
                  + Tavolo
                </button>

                <button
                  onClick={() => aggiungiElemento("STAND")}
                  disabled={!mappaSelezionata}
                  className="rounded-xl bg-blue-500 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-400 disabled:opacity-40"
                >
                  + Stand
                </button>

                <button
                  onClick={() => aggiungiElemento("CORRIDOIO")}
                  disabled={!mappaSelezionata}
                  className="rounded-xl bg-zinc-500 px-3 py-2 text-sm font-semibold text-white hover:bg-zinc-400 disabled:opacity-40"
                >
                  + Corridoio
                </button>

                <button
                  onClick={() => aggiungiElemento("AREA_SERVIZI")}
                  disabled={!mappaSelezionata}
                  className="rounded-xl bg-cyan-500 px-3 py-2 text-sm font-semibold text-white hover:bg-cyan-400 disabled:opacity-40"
                >
                  + Servizi
                </button>

                <button
                  onClick={() => aggiungiElemento("INGRESSO")}
                  disabled={!mappaSelezionata}
                  className="rounded-xl bg-lime-500 px-3 py-2 text-sm font-semibold text-white hover:bg-lime-400 disabled:opacity-40"
                >
                  + Ingresso
                </button>
              </div>
            </div>

            <div className="overflow-auto rounded-xl border bg-slate-100">
              <Stage width={stageWidth} height={stageHeight}>
                <Layer>
                  {mappaSelezionata && <ImmagineSfondo src={getFileUrl(mappaSelezionata.fileUrl)} width={stageWidth} height={stageHeight} />}

                  {elementi.map((elemento) => (
                    <ElementoDisegnato
                      key={elemento.id}
                      elemento={elemento}
                      elementoSelezionato={elementoSelezionato}
                      setElementoSelezionato={setElementoSelezionato}
                      setElementi={setElementi}
                      aggiornaElemento={aggiornaElemento}
                    />
                  ))}
                </Layer>
              </Stage>
            </div>
          </section>

          <aside className="rounded-2xl bg-white p-5 shadow">
            <h2 className="font-bold text-zinc-900">Dettagli elemento</h2>

            {!elementoSelezionato && <p className="mt-4 text-sm text-zinc-500">Seleziona un elemento dalla mappa.</p>}

            {elementoSelezionato && (
              <div className="mt-4 space-y-4">
                <input
                  type="text"
                  value={elementoSelezionato.nome || ""}
                  onChange={(e) => cambiaCampoElemento("nome", e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3"
                />

                <select
                  value={elementoSelezionato.tipo || "TAVOLO"}
                  onChange={(e) => cambiaCampoElemento("tipo", e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3"
                >
                  <option value="TAVOLO">Tavolo</option>
                  <option value="STAND">Stand</option>
                  <option value="CORRIDOIO">Corridoio</option>
                  <option value="AREA_SERVIZI">Area servizi</option>
                  <option value="INGRESSO">Ingresso</option>
                </select>

                <select
                  value={elementoSelezionato.stato || "LIBERO"}
                  onChange={(e) => {
                    const stato = e.target.value;
                    cambiaCampoElemento("stato", stato);
                    cambiaCampoElemento("colore", getColoreDaStato(stato));
                  }}
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3"
                >
                  <option value="LIBERO">Libero</option>
                  <option value="PRENOTATO">Prenotato</option>
                  <option value="PAGATO">Pagato</option>
                  <option value="RISERVATO">Riservato</option>
                  <option value="NON_DISPONIBILE">Non disponibile</option>
                </select>

                <input
                  type="color"
                  value={elementoSelezionato.colore || "#22c55e"}
                  onChange={(e) => cambiaCampoElemento("colore", e.target.value)}
                  className="h-12 w-full rounded-xl border border-zinc-300"
                />

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    value={elementoSelezionato.larghezza || 0}
                    onChange={(e) => cambiaCampoElemento("larghezza", Number(e.target.value))}
                    className="rounded-xl border border-zinc-300 px-4 py-3"
                    placeholder="Larghezza"
                  />

                  <input
                    type="number"
                    value={elementoSelezionato.altezza || 0}
                    onChange={(e) => cambiaCampoElemento("altezza", Number(e.target.value))}
                    className="rounded-xl border border-zinc-300 px-4 py-3"
                    placeholder="Altezza"
                  />
                </div>

                <button onClick={salvaElementoSelezionato} className="w-full rounded-xl bg-emerald-500 py-3 font-semibold text-white hover:bg-emerald-400">
                  Salva modifiche
                </button>

                <button onClick={eliminaElemento} className="w-full rounded-xl bg-red-500 py-3 font-semibold text-white hover:bg-red-400">
                  Elimina elemento
                </button>
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}

function ElementoDisegnato({ elemento, elementoSelezionato, setElementoSelezionato, setElementi, aggiornaElemento }) {
  return (
    <>
      <Rect
        x={Number(elemento.x || 0)}
        y={Number(elemento.y || 0)}
        width={Number(elemento.larghezza || 100)}
        height={Number(elemento.altezza || 50)}
        fill={elemento.colore || "#22c55e"}
        stroke={elementoSelezionato?.id === elemento.id ? "#000000" : "#ffffff"}
        strokeWidth={3}
        cornerRadius={8}
        draggable
        onClick={() => setElementoSelezionato(elemento)}
        onTap={() => setElementoSelezionato(elemento)}
        onDragEnd={(e) => {
          const aggiornato = {
            ...elemento,
            x: e.target.x(),
            y: e.target.y(),
          };

          setElementi((lista) => lista.map((el) => (el.id === aggiornato.id ? aggiornato : el)));

          setElementoSelezionato(aggiornato);
          aggiornaElemento(aggiornato);
        }}
      />

      <Text
        x={Number(elemento.x || 0)}
        y={Number(elemento.y || 0) + Number(elemento.altezza || 50) / 2 - 8}
        width={Number(elemento.larghezza || 100)}
        align="center"
        text={elemento.nome || ""}
        fontSize={14}
        fontStyle="bold"
        fill="#111827"
        listening={false}
      />
    </>
  );
}

export default Mappe;
