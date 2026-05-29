package gestionale.aziendale.controller;

import gestionale.aziendale.entities.Categoria;
import gestionale.aziendale.enumm.TipoCategoria;
import gestionale.aziendale.payload.CategoriaDTO;
import gestionale.aziendale.service.CategoriaService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/categorie")
public class CategoriaController {

    private final CategoriaService categoriaService;

    public CategoriaController(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATORE')")
    public Categoria save(@RequestBody @Valid CategoriaDTO body) {
        return this.categoriaService.save(body);
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATORE')")
    public Page<Categoria> getAllCategorie(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "nome") String sortBy
    ) {
        return this.categoriaService.findAll(page, size, sortBy);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATORE')")
    public Categoria findById(@PathVariable UUID id) {
        return this.categoriaService.findById(id);
    }

    @GetMapping("/tipo/{tipo}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATORE')")
    public List<Categoria> findByTipo(@PathVariable TipoCategoria tipo) {
        return this.categoriaService.findByTipo(tipo);
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATORE')")
    public List<Categoria> searchByNome(@RequestParam String nome) {
        return this.categoriaService.searchByNome(nome);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATORE')")
    public Categoria update(@PathVariable UUID id, @RequestBody @Valid CategoriaDTO body) {
        return this.categoriaService.findByIdAndUpdate(id, body);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATORE')")
    public void delete(@PathVariable UUID id) {
        this.categoriaService.findByIdAndDelete(id);
    }
}
