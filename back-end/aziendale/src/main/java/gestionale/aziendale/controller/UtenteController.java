package gestionale.aziendale.controller;

import gestionale.aziendale.entities.Utente;
import gestionale.aziendale.login.UtenteDTO;
import gestionale.aziendale.service.UtenteService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/utenti")
public class UtenteController {

    private final UtenteService utenteService;

    public UtenteController(UtenteService utenteService) {
        this.utenteService = utenteService;
    }
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping
    public Page<Utente> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "cognome") String sortBy
    ) {
        return this.utenteService.findAll(page, size, sortBy);
    }
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/{utenteId}")
    public Utente getById(@PathVariable UUID utenteId) {
        return this.utenteService.findById(utenteId);
    }
    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/{utenteId}")
    public Utente getByIdAndUpdate(
            @PathVariable UUID utenteId,
            @RequestBody UtenteDTO body
    ) {
        return this.utenteService.findByIdAndUpdate(utenteId, body);
    }
    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/{utenteId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void getByIdAndDelete(@PathVariable UUID utenteId) {
        this.utenteService.findByIdAndDelete(utenteId);
    }
}
