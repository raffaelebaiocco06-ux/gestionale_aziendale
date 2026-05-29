package gestionale.aziendale.service;

import gestionale.aziendale.entities.Mezzo;
import gestionale.aziendale.entities.Scadenza;
import gestionale.aziendale.entities.Utente;
import gestionale.aziendale.exception.NotFound;
import gestionale.aziendale.payload.ScadenzaDTO;
import gestionale.aziendale.repository.ScadenzaRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class ScadenzaService {

    private final ScadenzaRepository scadenzaRepository;
    private final MezzoService mezzoService;
    private final CurrentUserService currentUserService;

    public ScadenzaService(
            ScadenzaRepository scadenzaRepository,
            MezzoService mezzoService,
            CurrentUserService currentUserService
    ) {
        this.scadenzaRepository = scadenzaRepository;
        this.mezzoService = mezzoService;
        this.currentUserService = currentUserService;
    }

    public Scadenza save(ScadenzaDTO body) {
        Utente utente = currentUserService.getUtenteLoggato();

        Mezzo mezzo = null;

        if (body.mezzoId() != null) {
            mezzo = mezzoService.findById(body.mezzoId());
        }

        Scadenza nuovaScadenza = new Scadenza(
                body.titolo(),
                body.descrizione(),
                body.dataScadenza(),
                body.tipo(),
                body.stato(),
                mezzo
        );

        nuovaScadenza.setUtente(utente);

        return scadenzaRepository.save(nuovaScadenza);
    }

    public Page<Scadenza> findAll(int page, int size, String sortBy) {
        if (size > 100 || size <= 0) size = 10;
        if (page < 0) page = 0;

        Utente utente = currentUserService.getUtenteLoggato();

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));

        return scadenzaRepository.findByUtenteId(utente.getId(), pageable);
    }

    public List<Scadenza> findAllList() {
        Utente utente = currentUserService.getUtenteLoggato();

        return scadenzaRepository.findByUtenteId(utente.getId());
    }

    public Scadenza findById(UUID id) {
        Utente utente = currentUserService.getUtenteLoggato();

        return scadenzaRepository.findByIdAndUtenteId(id, utente.getId())
                .orElseThrow(() -> new NotFound("Scadenza con id " + id + " non trovata"));
    }

    public Scadenza findByIdAndUpdate(UUID id, ScadenzaDTO body) {
        Scadenza trovata = findById(id);

        Mezzo mezzo = null;

        if (body.mezzoId() != null) {
            mezzo = mezzoService.findById(body.mezzoId());
        }

        trovata.setTitolo(body.titolo());
        trovata.setDescrizione(body.descrizione());
        trovata.setDataScadenza(body.dataScadenza());
        trovata.setTipo(body.tipo());
        trovata.setStato(body.stato());
        trovata.setMezzo(mezzo);

        return scadenzaRepository.save(trovata);
    }

    public void findByIdAndDelete(UUID id) {
        Scadenza trovata = findById(id);
        scadenzaRepository.delete(trovata);
    }

    public List<Scadenza> findByMezzoId(UUID mezzoId) {
        Utente utente = currentUserService.getUtenteLoggato();

        return scadenzaRepository.findByMezzoIdAndUtenteId(
                mezzoId,
                utente.getId()
        );
    }

    public List<Scadenza> findScadute() {
        Utente utente = currentUserService.getUtenteLoggato();

        return scadenzaRepository.findByDataScadenzaBeforeAndUtenteId(
                LocalDate.now(),
                utente.getId()
        );
    }

    public List<Scadenza> findImminenti() {
        Utente utente = currentUserService.getUtenteLoggato();

        LocalDate oggi = LocalDate.now();
        LocalDate tra30Giorni = oggi.plusDays(30);

        return scadenzaRepository.findByDataScadenzaBetweenAndUtenteId(
                oggi,
                tra30Giorni,
                utente.getId()
        );
    }

    public List<Scadenza> findByStato(gestionale.aziendale.enumm.StatoScadenza stato) {
        Utente utente = currentUserService.getUtenteLoggato();

        return scadenzaRepository.findByStatoAndUtenteId(
                stato,
                utente.getId()
        );
    }

    public List<Scadenza> findByTipo(gestionale.aziendale.enumm.TipoScadenza tipo) {
        Utente utente = currentUserService.getUtenteLoggato();

        return scadenzaRepository.findByTipoAndUtenteId(
                tipo,
                utente.getId()
        );
    }
}