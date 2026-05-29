package gestionale.aziendale.service;

import gestionale.aziendale.entities.Fornitore;
import gestionale.aziendale.entities.Utente;
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
    private final CurrentUserService currentUserService;

    public FornitoreService(
            FornitoreRepository fornitoreRepository,
            CurrentUserService currentUserService
    ) {
        this.fornitoreRepository = fornitoreRepository;
        this.currentUserService = currentUserService;
    }

    public Fornitore save(FornitoreDTO body) {
        Utente utente = currentUserService.getUtenteLoggato();

        if (fornitoreRepository.existsByEmailAndUtenteId(body.email(), utente.getId())) {
            throw new BadRequEx("L'email " + body.email() + " è già in uso!");
        }

        if (fornitoreRepository.existsByPartitaIvaAndUtenteId(body.partitaIva(), utente.getId())) {
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

        nuovoFornitore.setUtente(utente);

        return fornitoreRepository.save(nuovoFornitore);
    }

    public Page<Fornitore> findAll(int page, int size, String sortBy) {
        if (size > 100 || size <= 0) size = 10;
        if (page < 0) page = 0;

        Utente utente = currentUserService.getUtenteLoggato();

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));

        return fornitoreRepository.findByUtenteId(utente.getId(), pageable);
    }

    public Fornitore findById(UUID id) {
        Utente utente = currentUserService.getUtenteLoggato();

        return fornitoreRepository.findByIdAndUtenteId(id, utente.getId())
                .orElseThrow(() -> new NotFound("Fornitore con id " + id + " non trovato"));
    }

    public Fornitore findByIdAndUpdate(UUID id, FornitoreDTO body) {
        Utente utente = currentUserService.getUtenteLoggato();

        Fornitore trovato = findById(id);

        if (!trovato.getEmail().equalsIgnoreCase(body.email())) {
            if (fornitoreRepository.existsByEmailAndUtenteId(body.email(), utente.getId())) {
                throw new BadRequEx("L'email " + body.email() + " è già in uso!");
            }
        }

        if (!trovato.getPartitaIva().equalsIgnoreCase(body.partitaIva())) {
            if (fornitoreRepository.existsByPartitaIvaAndUtenteId(body.partitaIva(), utente.getId())) {
                throw new BadRequEx("La partita IVA " + body.partitaIva() + " è già in uso!");
            }
        }

        trovato.setNome(body.nome());
        trovato.setPartitaIva(body.partitaIva());
        trovato.setTelefono(body.telefono());
        trovato.setEmail(body.email());
        trovato.setIndirizzo(body.indirizzo());
        trovato.setCategoria(body.categoria());

        return fornitoreRepository.save(trovato);
    }

    public void findByIdAndDelete(UUID id) {
        Fornitore trovato = findById(id);
        fornitoreRepository.delete(trovato);
    }

    public Fornitore findByEmail(String email) {
        Utente utente = currentUserService.getUtenteLoggato();

        return fornitoreRepository.findByEmailAndUtenteId(email, utente.getId())
                .orElseThrow(() -> new NotFound("Fornitore con email " + email + " non trovato"));
    }

    public Fornitore findByPartitaIva(String partitaIva) {
        Utente utente = currentUserService.getUtenteLoggato();

        return fornitoreRepository.findByPartitaIvaAndUtenteId(partitaIva, utente.getId())
                .orElseThrow(() -> new NotFound("Fornitore con partita IVA " + partitaIva + " non trovato"));
    }

    public List<Fornitore> searchByNome(String nome) {
        Utente utente = currentUserService.getUtenteLoggato();

        return fornitoreRepository.findByNomeContainingIgnoreCaseAndUtenteId(nome, utente.getId());
    }

    public List<Fornitore> searchByCategoria(String categoria) {
        Utente utente = currentUserService.getUtenteLoggato();

        return fornitoreRepository.findByCategoriaContainingIgnoreCaseAndUtenteId(categoria, utente.getId());
    }
}