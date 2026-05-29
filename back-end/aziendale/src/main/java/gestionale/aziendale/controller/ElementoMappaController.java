package gestionale.aziendale.controller;

import gestionale.aziendale.entities.ElementoMappa;
import gestionale.aziendale.payload.ElementoMappaDTO;
import gestionale.aziendale.payload.GeneraGrigliaDTO;
import gestionale.aziendale.service.ElementoMappaService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ElementoMappaController {

    private final ElementoMappaService elementoMappaService;

    public ElementoMappaController(ElementoMappaService elementoMappaService) {
        this.elementoMappaService = elementoMappaService;
    }

    @PostMapping("/mappe-fiera/{mappaId}/elementi")
    public ElementoMappa creaElemento(
            @PathVariable UUID mappaId,
            @Valid @RequestBody ElementoMappaDTO dto
    ) {
        return elementoMappaService.creaElemento(mappaId, dto);
    }

    @GetMapping("/mappe-fiera/{mappaId}/elementi")
    public List<ElementoMappa> trovaElementiPerMappa(@PathVariable UUID mappaId) {
        return elementoMappaService.trovaElementiPerMappa(mappaId);
    }

    @PutMapping("/elementi-mappa/{elementoId}")
    public ElementoMappa aggiornaElemento(
            @PathVariable UUID elementoId,
            @Valid @RequestBody ElementoMappaDTO dto
    ) {
        return elementoMappaService.aggiornaElemento(elementoId, dto);
    }

    @DeleteMapping("/elementi-mappa/{elementoId}")
    public void eliminaElemento(@PathVariable UUID elementoId) {
        elementoMappaService.eliminaElemento(elementoId);
    }

    @PostMapping("/mappe-fiera/{mappaId}/genera-griglia")
    public List<ElementoMappa> generaGriglia(
            @PathVariable UUID mappaId,
            @Valid @RequestBody GeneraGrigliaDTO dto
    ) {
        return elementoMappaService.generaGriglia(mappaId, dto);
    }
}