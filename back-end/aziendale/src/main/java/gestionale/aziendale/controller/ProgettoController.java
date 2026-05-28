package gestionale.aziendale.controller;
import gestionale.aziendale.entities.Progetto;
import gestionale.aziendale.payload.ProgettoDTO;
import gestionale.aziendale.service.ProgettoService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/progetti")
public class ProgettoController {

    private final ProgettoService progettoService;

    public ProgettoController(ProgettoService progettoService) {
        this.progettoService = progettoService;
    }

    @GetMapping
    public Page<Progetto> getAll(Pageable pageable) {

        List<Progetto> progetti = progettoService.findAll();

        return new PageImpl<>(progetti, pageable, progetti.size());
    }

    @GetMapping("/{id}")
    public Progetto getById(@PathVariable UUID id) {
        return progettoService.findById(id);
    }

    @PostMapping
    public Progetto create(@RequestBody ProgettoDTO dto) {
        return progettoService.salva(dto);
    }

    @PutMapping("/{id}")
    public Progetto update(@PathVariable UUID id, @RequestBody ProgettoDTO dto) {
        return progettoService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        progettoService.delete(id);
    }
}
