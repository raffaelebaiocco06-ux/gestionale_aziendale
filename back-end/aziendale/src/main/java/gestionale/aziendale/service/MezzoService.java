package gestionale.aziendale.service;

import gestionale.aziendale.entities.Mezzo;
import gestionale.aziendale.entities.Utente;
import gestionale.aziendale.exception.BadRequEx;
import gestionale.aziendale.exception.NotFound;
import gestionale.aziendale.payload.MezzoDTO;
import gestionale.aziendale.repository.MezzoRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class MezzoService {

    private final MezzoRepository mezzoRepository;
    private final CurrentUserService currentUserService;

    public MezzoService(
            MezzoRepository mezzoRepository,
            CurrentUserService currentUserService
    ) {
        this.mezzoRepository = mezzoRepository;
        this.currentUserService = currentUserService;
    }

    public Mezzo save(MezzoDTO body) {
        Utente utente = currentUserService.getUtenteLoggato();

        if (mezzoRepository.existsByTargaAndUtenteId(body.targa(), utente.getId())) {
            throw new BadRequEx("La targa " + body.targa() + " è già in uso!");
        }

        Mezzo nuovoMezzo = new Mezzo(
                body.targa(),
                body.marca(),
                body.modello(),
                body.tipo(),
                body.anno(),
                body.assicurazioneScadenza(),
                body.bolloScadenza(),
                body.revisioneScadenza()
        );

        nuovoMezzo.setUtente(utente);

        return mezzoRepository.save(nuovoMezzo);
    }

    public Page<Mezzo> findAll(int page, int size, String sortBy) {
        if (size > 100 || size <= 0) size = 10;
        if (page < 0) page = 0;

        Utente utente = currentUserService.getUtenteLoggato();

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));

        return mezzoRepository.findByUtenteId(utente.getId(), pageable);
    }

    public Mezzo findById(UUID id) {
        Utente utente = currentUserService.getUtenteLoggato();

        return mezzoRepository.findByIdAndUtenteId(id, utente.getId())
                .orElseThrow(() -> new NotFound("Mezzo con id " + id + " non trovato"));
    }

    public Mezzo findByIdAndUpdate(UUID id, MezzoDTO body) {
        Utente utente = currentUserService.getUtenteLoggato();

        Mezzo trovato = findById(id);

        if (!trovato.getTarga().equalsIgnoreCase(body.targa())) {
            if (mezzoRepository.existsByTargaAndUtenteId(body.targa(), utente.getId())) {
                throw new BadRequEx("La targa " + body.targa() + " è già in uso!");
            }
        }

        trovato.setTarga(body.targa());
        trovato.setMarca(body.marca());
        trovato.setModello(body.modello());
        trovato.setTipo(body.tipo());
        trovato.setAnno(body.anno());
        trovato.setAssicurazioneScadenza(body.assicurazioneScadenza());
        trovato.setBolloScadenza(body.bolloScadenza());
        trovato.setRevisioneScadenza(body.revisioneScadenza());

        return mezzoRepository.save(trovato);
    }

    public void findByIdAndDelete(UUID id) {
        Mezzo trovato = findById(id);
        mezzoRepository.delete(trovato);
    }

    public Mezzo findByTarga(String targa) {
        Utente utente = currentUserService.getUtenteLoggato();

        return mezzoRepository.findByTargaAndUtenteId(targa, utente.getId())
                .orElseThrow(() -> new NotFound("Mezzo con targa " + targa + " non trovato"));
    }
}