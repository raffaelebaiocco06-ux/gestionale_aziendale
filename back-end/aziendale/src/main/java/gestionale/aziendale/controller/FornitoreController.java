package gestionale.aziendale.controller;

import gestionale.aziendale.entities.Fornitore;
import gestionale.aziendale.payload.FornitoreDTO;
import gestionale.aziendale.service.FornitoreService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/fornitori")
public class FornitoreController {

    private final FornitoreService fornitoreService;

    public FornitoreController(FornitoreService fornitoreService) {
        this.fornitoreService = fornitoreService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATORE')")
    public Fornitore save(@RequestBody @Valid FornitoreDTO body) {
        return this.fornitoreService.save(body);
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATORE')")
    public Page<Fornitore> getAllFornitori(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "nome") String sortBy
    ) {
        return this.fornitoreService.findAll(page, size, sortBy);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATORE')")
    public Fornitore findById(@PathVariable UUID id) {
        return this.fornitoreService.findById(id);
    }

    @GetMapping("/email/{email}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATORE')")
    public Fornitore findByEmail(@PathVariable String email) {
        return this.fornitoreService.findByEmail(email);
    }

    @GetMapping("/partita-iva/{partitaIva}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATORE')")
    public Fornitore findByPartitaIva(@PathVariable String partitaIva) {
        return this.fornitoreService.findByPartitaIva(partitaIva);
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATORE')")
    public List<Fornitore> searchByNome(@RequestParam String nome) {
        return this.fornitoreService.searchByNome(nome);
    }

    @GetMapping("/search/categoria")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATORE')")
    public List<Fornitore> searchByCategoria(@RequestParam String categoria) {
        return this.fornitoreService.searchByCategoria(categoria);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATORE')")
    public Fornitore update(@PathVariable UUID id, @RequestBody @Valid FornitoreDTO body) {
        return this.fornitoreService.findByIdAndUpdate(id, body);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATORE')")
    public void delete(@PathVariable UUID id) {
        this.fornitoreService.findByIdAndDelete(id);
    }
}
