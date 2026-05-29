package gestionale.aziendale.controller;

import gestionale.aziendale.entities.Movimento;
import gestionale.aziendale.payload.MovimentoDTO;
import gestionale.aziendale.service.MovimentoService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/movimenti")
public class MovimentoController {

    private final MovimentoService movimentoService;

    public MovimentoController(MovimentoService movimentoService) {
        this.movimentoService = movimentoService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATORE')")
    public Movimento save(@RequestBody @Valid MovimentoDTO body) {
        return this.movimentoService.save(body);
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATORE')")
    public Page<Movimento> getAllMovimenti(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "dataMovimento") String sortBy
    ) {
        return this.movimentoService.findAll(page, size, sortBy);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATORE')")
    public Movimento findById(@PathVariable UUID id) {
        return this.movimentoService.findById(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATORE')")
    public Movimento update(@PathVariable UUID id, @RequestBody @Valid MovimentoDTO body) {
        return this.movimentoService.findByIdAndUpdate(id, body);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATORE')")
    public void delete(@PathVariable UUID id) {
        this.movimentoService.findByIdAndDelete(id);
    }
}
