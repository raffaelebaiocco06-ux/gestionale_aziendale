package gestionale.aziendale.controller;

import gestionale.aziendale.entities.Cliente;
import gestionale.aziendale.payload.ClienteDTO;
import gestionale.aziendale.service.ClienteService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/clienti")
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('ADMIN')")
    public Cliente save(@RequestBody @Valid ClienteDTO body) {
        return this.clienteService.save(body);
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATORE')")
    public Page<Cliente> getAllClienti(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "nome") String sortBy
    ) {
        return this.clienteService.findAll(page, size, sortBy);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATORE')")
    public Cliente findById(@PathVariable UUID id) {
        return this.clienteService.findById(id);
    }

    @GetMapping("/email/{email}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATORE')")
    public Cliente findByEmail(@PathVariable String email) {
        return this.clienteService.findByEmail(email);
    }

    @GetMapping("/partita-iva/{partitaIva}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATORE')")
    public Cliente findByPartitaIva(@PathVariable String partitaIva) {
        return this.clienteService.findByPartitaIva(partitaIva);
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATORE')")
    public List<Cliente> searchByNome(@RequestParam String nome) {
        return this.clienteService.searchByNome(nome);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public Cliente update(@PathVariable UUID id, @RequestBody @Valid ClienteDTO body) {
        return this.clienteService.findByIdAndUpdate(id, body);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('ADMIN')")
    public void delete(@PathVariable UUID id) {
        this.clienteService.findByIdAndDelete(id);
    }
}
