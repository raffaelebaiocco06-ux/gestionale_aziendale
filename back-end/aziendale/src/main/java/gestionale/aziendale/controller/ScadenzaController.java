package gestionale.aziendale.controller;

import gestionale.aziendale.payload.ScadenzaDTO;
import gestionale.aziendale.entities.Scadenza;
import gestionale.aziendale.service.ScadenzaService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/scadenze")
public class ScadenzaController {

    private final ScadenzaService scadenzaService;

    public ScadenzaController(ScadenzaService scadenzaService) {
        this.scadenzaService = scadenzaService;
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATORE')")
    public Page<Scadenza> getScadenze(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "dataScadenza") String sortBy
    ) {
        return this.scadenzaService.findAll(page, size, sortBy);
    }

    @GetMapping("/{scadenzaId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATORE')")
    public Scadenza getById(@PathVariable UUID scadenzaId) {
        return this.scadenzaService.findById(scadenzaId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATORE')")
    public Scadenza saveScadenza(@RequestBody @Valid ScadenzaDTO body) {
        return this.scadenzaService.save(body);
    }

    @PutMapping("/{scadenzaId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATORE')")
    public Scadenza updateScadenza(
            @PathVariable UUID scadenzaId,
            @RequestBody @Valid ScadenzaDTO body
    ) {
        return this.scadenzaService.findByIdAndUpdate(scadenzaId, body);
    }

    @DeleteMapping("/{scadenzaId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATORE')")
    public void deleteScadenza(@PathVariable UUID scadenzaId) {
        this.scadenzaService.findByIdAndDelete(scadenzaId);
    }

    @GetMapping("/mezzo/{mezzoId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATORE')")
    public List<Scadenza> getScadenzeByMezzo(@PathVariable UUID mezzoId) {
        return this.scadenzaService.findByMezzoId(mezzoId);
    }

    @GetMapping("/scadute")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATORE')")
    public List<Scadenza> getScadenzeScadute() {
        return this.scadenzaService.findScadute();
    }

    @GetMapping("/imminenti")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATORE')")
    public List<Scadenza> getScadenzeImminenti() {
        return this.scadenzaService.findImminenti();
    }
}