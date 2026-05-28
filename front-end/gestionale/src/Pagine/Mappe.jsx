import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Rect, Text, Image as KonvaImage, Transformer, Group } from "react-konva";
import useImage from "use-image";
import { getMappe, uploadMappa, getElementiMappa, createElementoMappa, updateElementoMappa, deleteElementoMappa } from "../js/mappe";

function ImmagineSfondo({ src, imageWidth, imageHeight }) {
  const [image] = useImage(src, "anonymous");

  if (!image) return null;

  return <KonvaImage image={image} x={0} y={0} width={imageWidth} height={imageHeight} listening={false} />;
}

function Mappe() {
  const [mappe, setMappe] = useState([]);
  const [mappaSelezionata, setMappaSelezionata] = useState(null);
  const [elementi, setElementi] = useState([]);
  const [file, setFile] = useState(null);
  const [nomeMappa, setNomeMappa] = useState("");
  const [elementoSelezionato, setElementoSelezionato] = useState(null);
  const [errore, setErrore] = useState("");

  const [stageSize, setStageSize] = useState({ width: 900, height: 700 });
  const [stageScale, setStageScale] = useState(1);
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });

  const containerRef = useRef(null);
  const fileInputRef = useRef(null);

  const imageWidth = 1200;
  const imageHeight = 1600;

  const normalizzaLista = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.content)) return data.content;
    return [];
  };

  useEffect(() => {
    const aggiornaDimensioni = () => {
      if (!containerRef.current) return;

      const larghezza = containerRef.current.offsetWidth;
      const altezza = window.innerWidth < 768 ? 560 : 760;

      setStageSize({
        width: larghezza,
        height: altezza,
      });
    };

    aggiornaDimensioni();
    window.addEventListener("resize", aggiornaDimensioni);

    return () => window.removeEventListener("resize", aggiornaDimensioni);
  }, []);

  const caricaMappe = async () => {
    try {
      const risposta = await getMappe();
      setMappe(normalizzaLista(risposta.data));
    } catch (error) {
      console.error(error);
      setErrore("Errore durante il caricamento delle mappe");
    }
  };

  useEffect(() => {
    caricaMappe();
  }, []);

  const selezionaMappa = async (mappa) => {
    try {
      setMappaSelezionata(mappa);
      setElementoSelezionato(null);

      const risposta = await getElementiMappa(mappa.id);
      setElementi(normalizzaLista(risposta.data));

      setStageScale(0.65);
      setStagePosition({ x: 20, y: 20 });
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

    if (!file.type.startsWith("image/")) {
      setErrore("Carica solo immagini PNG, JPG o WEBP.");
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

  const getFileUrl = (fileUrl) => {
    if (!fileUrl) return "";
    if (fileUrl.startsWith("http")) return fileUrl;

    const percorsoPulito = fileUrl.replaceAll("\\", "/");

    if (percorsoPulito.startsWith("/")) {
      return `http://localhost:3001${percorsoPulito}`;
    }

    return `http://localhost:3001/${percorsoPulito}`;
  };

  const getColoreDaStato = (stato) => {
    if (stato === "LIBERO") return "#22c55e";
    if (stato === "PRENOTATO") return "#facc15";
    if (stato === "PAGATO") return "#3b82f6";
    if (stato === "RISERVATO") return "#a855f7";
    return "#ef4444";
  };

  const aggiungiElemento = async (tipo = "TAVOLO") => {
    if (!mappaSelezionata) return;

    const config = {
      TAVOLO: {
        nome: "Tavolo " + (elementi.length + 1),
        larghezza: 80,
        altezza: 28,
        stato: "LIBERO",
      },
      STAND: {
        nome: "Stand " + (elementi.length + 1),
        larghezza: 120,
        altezza: 70,
        stato: "LIBERO",
      },
      CORRIDOIO: {
        nome: "Corridoio " + (elementi.length + 1),
        larghezza: 220,
        altezza: 35,
        stato: "NON_DISPONIBILE",
      },
      AREA_SERVIZI: {
        nome: "Servizi " + (elementi.length + 1),
        larghezza: 120,
        altezza: 70,
        stato: "RISERVATO",
      },
      INGRESSO: {
        nome: "Ingresso " + (elementi.length + 1),
        larghezza: 120,
        altezza: 50,
        stato: "RISERVATO",
      },
    }[tipo];

    const nuovoElemento = {
      nome: config.nome,
      tipo,
      x: 100,
      y: 100,
      larghezza: config.larghezza,
      altezza: config.altezza,
      colore: getColoreDaStato(config.stato),
      stato: config.stato,
    };

    try {
      const risposta = await createElementoMappa(mappaSelezionata.id, nuovoElemento);

      setElementi((lista) => [...lista, risposta.data]);
      setElementoSelezionato(risposta.data);
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

  const zoom = (fattore) => {
    const nuovoZoom = Math.max(0.25, Math.min(3, stageScale * fattore));
    setStageScale(nuovoZoom);
  };

  const resetVista = () => {
    setStageScale(0.65);
    setStagePosition({ x: 20, y: 20 });
  };

  const handleWheel = (e) => {
    e.evt.preventDefault();

    const scaleBy = 1.08;
    const stage = e.target.getStage();
    const oldScale = stageScale;
    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - stagePosition.x) / oldScale,
      y: (pointer.y - stagePosition.y) / oldScale,
    };

    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    const limitedScale = Math.max(0.25, Math.min(3, newScale));

    setStageScale(limitedScale);

    setStagePosition({
      x: pointer.x - mousePointTo.x * limitedScale,
      y: pointer.y - mousePointTo.y * limitedScale,
    });
  };

  return (
    <main className="p-3 md:p-8">
      <div className="mx-auto max-w-[1600px]">
        <h1 className="text-2xl font-bold text-zinc-900 md:text-3xl">Mappe Fiera</h1>

        <p className="mt-2 text-sm text-zinc-600 md:text-base">Carica una piantina fieristica e gestisci tavoli, stand ed espositori.</p>

        {errore && <div className="mt-6 rounded-xl bg-red-100 p-4 text-red-700">{errore}</div>}

        <form onSubmit={caricaNuovaMappa} className="mt-6 grid gap-4 rounded-2xl bg-white p-5 shadow md:grid-cols-3">
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
            accept="image/png,image/jpeg,image/webp"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="rounded-xl border border-zinc-300 px-4 py-3"
          />

          <button className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-white hover:bg-emerald-400">Carica mappa</button>
        </form>

        <div className="mt-6 grid gap-6 xl:grid-cols-[270px_1fr_300px]">
          <aside className="rounded-2xl bg-white p-5 shadow">
            <h2 className="font-bold text-zinc-900">Mappe disponibili</h2>

            <div className="mt-4 max-h-[500px] space-y-2 overflow-y-auto">
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

          <section className="rounded-2xl bg-white p-4 shadow">
            <div className="mb-4 flex flex-col gap-3 2xl:flex-row 2xl:items-center 2xl:justify-between">
              <h2 className="font-bold text-zinc-900">{mappaSelezionata ? mappaSelezionata.nome : "Nessuna mappa selezionata"}</h2>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => aggiungiElemento("TAVOLO")}
                  disabled={!mappaSelezionata}
                  className="rounded-xl bg-emerald-500 px-3 py-2 text-xs font-semibold text-white disabled:opacity-40"
                >
                  + Tavolo
                </button>

                <button
                  onClick={() => aggiungiElemento("STAND")}
                  disabled={!mappaSelezionata}
                  className="rounded-xl bg-blue-500 px-3 py-2 text-xs font-semibold text-white disabled:opacity-40"
                >
                  + Stand
                </button>

                <button
                  onClick={() => aggiungiElemento("CORRIDOIO")}
                  disabled={!mappaSelezionata}
                  className="rounded-xl bg-zinc-500 px-3 py-2 text-xs font-semibold text-white disabled:opacity-40"
                >
                  + Corridoio
                </button>

                <button
                  onClick={() => aggiungiElemento("AREA_SERVIZI")}
                  disabled={!mappaSelezionata}
                  className="rounded-xl bg-cyan-500 px-3 py-2 text-xs font-semibold text-white disabled:opacity-40"
                >
                  + Servizi
                </button>

                <button
                  onClick={() => aggiungiElemento("INGRESSO")}
                  disabled={!mappaSelezionata}
                  className="rounded-xl bg-lime-500 px-3 py-2 text-xs font-semibold text-white disabled:opacity-40"
                >
                  + Ingresso
                </button>

                <button onClick={() => zoom(1.2)} className="rounded-xl bg-slate-800 px-3 py-2 text-xs font-semibold text-white">
                  Zoom +
                </button>

                <button onClick={() => zoom(0.8)} className="rounded-xl bg-slate-800 px-3 py-2 text-xs font-semibold text-white">
                  Zoom -
                </button>

                <button onClick={resetVista} className="rounded-xl bg-slate-200 px-3 py-2 text-xs font-semibold text-zinc-800">
                  Reset
                </button>
              </div>
            </div>

            <div ref={containerRef} className="overflow-hidden rounded-xl border bg-slate-100">
              <Stage
                width={stageSize.width}
                height={stageSize.height}
                scaleX={stageScale}
                scaleY={stageScale}
                x={stagePosition.x}
                y={stagePosition.y}
                draggable
                onDragEnd={(e) =>
                  setStagePosition({
                    x: e.target.x(),
                    y: e.target.y(),
                  })
                }
                onWheel={handleWheel}
                onMouseDown={(e) => {
                  if (e.target === e.target.getStage()) {
                    setElementoSelezionato(null);
                  }
                }}
              >
                <Layer>
                  {mappaSelezionata && <ImmagineSfondo src={getFileUrl(mappaSelezionata.fileUrl)} imageWidth={imageWidth} imageHeight={imageHeight} />}

                  {elementi.map((elemento) => (
                    <ElementoDisegnato
                      key={elemento.id}
                      elemento={elemento}
                      selezionato={elementoSelezionato?.id === elemento.id}
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

function ElementoDisegnato({ elemento, selezionato, setElementoSelezionato, setElementi, aggiornaElemento }) {
  const shapeRef = useRef(null);
  const transformerRef = useRef(null);

  useEffect(() => {
    if (selezionato && transformerRef.current && shapeRef.current) {
      transformerRef.current.nodes([shapeRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [selezionato]);

  const salvaModifica = (node) => {
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    const aggiornato = {
      ...elemento,
      x: node.x(),
      y: node.y(),
      larghezza: Math.max(20, node.width() * scaleX),
      altezza: Math.max(15, node.height() * scaleY),
    };

    node.scaleX(1);
    node.scaleY(1);

    setElementi((lista) => lista.map((el) => (el.id === aggiornato.id ? aggiornato : el)));

    setElementoSelezionato(aggiornato);
    aggiornaElemento(aggiornato);
  };

  return (
    <>
      <Group
        ref={shapeRef}
        x={Number(elemento.x || 0)}
        y={Number(elemento.y || 0)}
        width={Number(elemento.larghezza || 80)}
        height={Number(elemento.altezza || 28)}
        draggable
        onClick={() => setElementoSelezionato(elemento)}
        onTap={() => setElementoSelezionato(elemento)}
        onDragEnd={(e) => salvaModifica(e.target)}
        onTransformEnd={(e) => salvaModifica(e.target)}
      >
        <Rect
          width={Number(elemento.larghezza || 80)}
          height={Number(elemento.altezza || 28)}
          fill={elemento.colore || "#22c55e"}
          stroke={selezionato ? "#000000" : "#ffffff"}
          strokeWidth={2}
          cornerRadius={4}
          opacity={0.85}
        />

        <Text
          x={2}
          y={Number(elemento.altezza || 28) / 2 - 5}
          width={Number(elemento.larghezza || 80) - 4}
          align="center"
          text={elemento.nome || ""}
          fontSize={8}
          fontStyle="bold"
          fill="#111827"
          listening={false}
        />
      </Group>

      {selezionato && (
        <Transformer
          ref={transformerRef}
          rotateEnabled={true}
          enabledAnchors={["top-left", "top-right", "bottom-left", "bottom-right", "middle-left", "middle-right"]}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 20 || newBox.height < 15) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
}

export default Mappe;
