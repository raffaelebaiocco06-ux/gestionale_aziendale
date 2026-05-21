package gestionale.aziendale.service;

import gestionale.aziendale.entities.ElementoMappa;
import gestionale.aziendale.entities.MappaFiera;
import gestionale.aziendale.enumm.StatoElementoMappa;
import gestionale.aziendale.enumm.TipoElementoMappa;
import gestionale.aziendale.payload.ElementoMappaDTO;
import gestionale.aziendale.payload.GeneraGrigliaDTO;
import gestionale.aziendale.repository.ElementoMappaRepository;
import gestionale.aziendale.repository.MappaFieraRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ElementoMappaService {

    private final ElementoMappaRepository elementoMappaRepository;
    private final MappaFieraRepository mappaFieraRepository;

    public ElementoMappaService(
            ElementoMappaRepository elementoMappaRepository,
            MappaFieraRepository mappaFieraRepository
    ) {
        this.elementoMappaRepository = elementoMappaRepository;
        this.mappaFieraRepository = mappaFieraRepository;
    }

    public ElementoMappa creaElemento(UUID mappaId, ElementoMappaDTO dto) {
        MappaFiera mappa = mappaFieraRepository.findById(mappaId)
                .orElseThrow(() -> new RuntimeException("Mappa fiera non trovata"));

        ElementoMappa elemento = new ElementoMappa();

        elemento.setMappaFiera(mappa);
        elemento.setNome(dto.nome());
        elemento.setTipo(dto.tipo());
        elemento.setX(dto.x());
        elemento.setY(dto.y());
        elemento.setLarghezza(dto.larghezza());
        elemento.setAltezza(dto.altezza());
        elemento.setColore(dto.colore());
        elemento.setStato(dto.stato());

        return elementoMappaRepository.save(elemento);
    }

    public List<ElementoMappa> trovaElementiPerMappa(UUID mappaId) {
        return elementoMappaRepository.findByMappaFieraId(mappaId);
    }

    public ElementoMappa aggiornaElemento(UUID elementoId, ElementoMappaDTO dto) {
        ElementoMappa elemento = elementoMappaRepository.findById(elementoId).orElseThrow(() -> new RuntimeException("Elemento mappa non trovato"));

        elemento.setNome(dto.nome());
        elemento.setTipo(dto.tipo());
        elemento.setX(dto.x());
        elemento.setY(dto.y());
        elemento.setLarghezza(dto.larghezza());
        elemento.setAltezza(dto.altezza());
        elemento.setColore(dto.colore());
        elemento.setStato(dto.stato());

        return elementoMappaRepository.save(elemento);
    }

    public void eliminaElemento(UUID elementoId) {
        ElementoMappa elemento = elementoMappaRepository.findById(elementoId).orElseThrow(() -> new RuntimeException("Elemento mappa non trovato"));

        elementoMappaRepository.delete(elemento);
    }

    public List<ElementoMappa> generaGriglia(UUID mappaId, GeneraGrigliaDTO dto) {
        MappaFiera mappa = mappaFieraRepository.findById(mappaId).orElseThrow(() -> new RuntimeException("Mappa fiera non trovata"));

        List<ElementoMappa> elementi = new ArrayList<>();

        int numero = 1;

        for (int r = 0; r < dto.righe(); r++) {
            for (int c = 0; c < dto.colonne(); c++) {

                double x = dto.xIniziale() + c * (dto.larghezza() + dto.spazioX());
                double y = dto.yIniziale() + r * (dto.altezza() + dto.spazioY());

                ElementoMappa elemento = new ElementoMappa();

                elemento.setMappaFiera(mappa);
                elemento.setNome("Tavolo " + numero++);
                elemento.setTipo(TipoElementoMappa.TAVOLO);
                elemento.setX(x);
                elemento.setY(y);
                elemento.setLarghezza(dto.larghezza());
                elemento.setAltezza(dto.altezza());
                elemento.setColore("#22c55e");
                elemento.setStato(StatoElementoMappa.LIBERO);

                elementi.add(elemento);
            }
        }

        return elementoMappaRepository.saveAll(elementi);
    }
}
