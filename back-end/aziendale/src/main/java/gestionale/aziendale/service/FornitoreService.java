package gestionale.aziendale.service;

import gestionale.aziendale.entities.Fornitore;
import gestionale.aziendale.exception.BadRequEx;
import gestionale.aziendale.exception.NotFound;
import gestionale.aziendale.payload.FornitoreDTO;
import gestionale.aziendale.repository.FornitoreRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class FornitoreService {

    private final FornitoreRepository fornitoreRepository;

    public FornitoreService(FornitoreRepository fornitoreRepository) {
        this.fornitoreRepository = fornitoreRepository;
    }

    public Fornitore save(FornitoreDTO body) {
        if (this.fornitoreRepository.existsByEmail(body.email())) {
            throw new BadRequEx("L'email " + body.email() + " è già in uso!");
        }

        if (this.fornitoreRepository.existsByPartitaIva(body.partitaIva())) {
            throw new BadRequEx("La partita IVA " + body.partitaIva() + " è già in uso!");
        }

        Fornitore nuovoFornitore = new Fornitore(
                body.nome(),
                body.partitaIva(),
                body.telefono(),
                body.email(),
                body.indirizzo(),
                body.categoria()
        );

        return this.fornitoreRepository.save(nuovoFornitore);
    }

    public Page<Fornitore> findAll(int page, int size, String sortBy) {
        if (size > 100 || size <= 0) size = 10;
        if (page < 0) page = 0;

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return this.fornitoreRepository.findAll(pageable);
    }

    public Fornitore findById(UUID id) {
        return this.fornitoreRepository.findById(id)
                .orElseThrow(() -> new NotFound("Fornitore con id " + id + " non trovato"));
    }

    public Fornitore findByIdAndUpdate(UUID id, FornitoreDTO body) {
        Fornitore trovato = this.findById(id);

        if (!trovato.getEmail().equalsIgnoreCase(body.email())) {
            if (this.fornitoreRepository.existsByEmail(body.email())) {
                throw new BadRequEx("L'email " + body.email() + " è già in uso!");
            }
        }

        if (!trovato.getPartitaIva().equalsIgnoreCase(body.partitaIva())) {
            if (this.fornitoreRepository.existsByPartitaIva(body.partitaIva())) {
                throw new BadRequEx("La partita IVA " + body.partitaIva() + " è già in uso!");
            }
        }

        trovato.setNome(body.nome());
        trovato.setPartitaIva(body.partitaIva());
        trovato.setTelefono(body.telefono());
        trovato.setEmail(body.email());
        trovato.setIndirizzo(body.indirizzo());
        trovato.setCategoria(body.categoria());

        return this.fornitoreRepository.save(trovato);
    }

    public void findByIdAndDelete(UUID id) {
        Fornitore trovato = this.findById(id);
        this.fornitoreRepository.delete(trovato);
    }

    public Fornitore findByEmail(String email) {
        return this.fornitoreRepository.findByEmail(email)
                .orElseThrow(() -> new NotFound("Fornitore con email " + email + " non trovato"));
    }

    public Fornitore findByPartitaIva(String partitaIva) {
        return this.fornitoreRepository.findByPartitaIva(partitaIva)
                .orElseThrow(() -> new NotFound("Fornitore con partita IVA " + partitaIva + " non trovato"));
    }

    public List<Fornitore> searchByNome(String nome) {
        return this.fornitoreRepository.findByNomeContainingIgnoreCase(nome);
    }

    public List<Fornitore> searchByCategoria(String categoria) {
        return this.fornitoreRepository.findByCategoriaContainingIgnoreCase(categoria);
    }
}
