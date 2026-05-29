package gestionale.aziendale.controller;


import gestionale.aziendale.entities.Mezzo;
import gestionale.aziendale.payload.MezzoDTO;
import gestionale.aziendale.service.MezzoService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/mezzi")
public class MezzoController {
    private final MezzoService mezzoService;

    public MezzoController(MezzoService mezzoService) {
        this.mezzoService = mezzoService;
    }
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATORE')")
    public Mezzo save(@RequestBody @Validated MezzoDTO body) {
        return this.mezzoService.save(body);
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATORE')")
    public Page<Mezzo> getAllMezzi(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy
    ) {
        return this.mezzoService.findAll(page, size, sortBy);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATORE')")
    public Mezzo findById(@PathVariable UUID id) {
        return this.mezzoService.findById(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATORE')")
    public Mezzo findByIdAndUpdate(@PathVariable UUID id, @RequestBody @Validated MezzoDTO body) {
        return this.mezzoService.findByIdAndUpdate(id, body);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATORE')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void findByIdAndDelete(@PathVariable UUID id) {
        this.mezzoService.findByIdAndDelete(id);
    }

    @GetMapping("/targa/{targa}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATORE')")
    public Mezzo findByTarga(@PathVariable String targa) {
        return this.mezzoService.findByTarga(targa);
    }
}

