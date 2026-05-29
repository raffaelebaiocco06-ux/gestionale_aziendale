package gestionale.aziendale.controller;

import gestionale.aziendale.entities.MappaFiera;
import gestionale.aziendale.payload.MappaFieraDTO;
import gestionale.aziendale.service.MappaFieraService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/mappe-fiera")
@CrossOrigin(origins = "*")
public class MappaFieraController {

    private final MappaFieraService mappaFieraService;

    public MappaFieraController(MappaFieraService mappaFieraService) {
        this.mappaFieraService = mappaFieraService;
    }

    @PostMapping
    public MappaFiera creaMappa(@Valid @RequestBody MappaFieraDTO dto) {
        return mappaFieraService.creaMappa(dto);
    }

    @GetMapping
    public List<MappaFiera> trovaTutte() {
        return mappaFieraService.trovaTutte();
    }

    @GetMapping("/{id}")
    public MappaFiera trovaPerId(@PathVariable UUID id) {
        return mappaFieraService.trovaPerId(id);
    }

    @PutMapping("/{id}")
    public MappaFiera aggiornaMappa(
            @PathVariable UUID id,
            @Valid @RequestBody MappaFieraDTO dto
    ) {
        return mappaFieraService.aggiornaMappa(id, dto);
    }

    @DeleteMapping("/{id}")
    public void eliminaMappa(@PathVariable UUID id) {
        mappaFieraService.eliminaMappa(id);
    }
    @PostMapping("/upload")
    public MappaFiera uploadMappa(
            @RequestParam("nome") String nome,
            @RequestParam("file") MultipartFile file,
            @RequestParam("larghezzaOriginale") Integer larghezzaOriginale,
            @RequestParam("altezzaOriginale") Integer altezzaOriginale
    ) {
        return mappaFieraService.creaMappaConFile(nome, file, larghezzaOriginale, altezzaOriginale);
    }
}
