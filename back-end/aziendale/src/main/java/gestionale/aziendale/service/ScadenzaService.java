package gestionale.aziendale.service;

import gestionale.aziendale.entities.Mezzo;
import gestionale.aziendale.entities.Scadenza;
import gestionale.aziendale.enumm.StatoScadenza;
import gestionale.aziendale.enumm.TipoScadenza;
import gestionale.aziendale.exception.NotFound;
import gestionale.aziendale.payload.ScadenzaDTO;
import gestionale.aziendale.repository.MezzoRepository;
import gestionale.aziendale.repository.ScadenzaRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class ScadenzaService {

    private final ScadenzaRepository scadenzaRepository;
    private final MezzoRepository mezzoRepository;

    public ScadenzaService(ScadenzaRepository scadenzaRepository, MezzoRepository mezzoRepository) {
        this.scadenzaRepository = scadenzaRepository;
        this.mezzoRepository = mezzoRepository;
    }

    public Scadenza save(ScadenzaDTO body) {

        Mezzo mezzo = null;

        if (body.mezzoId() != null) {
            mezzo = this.mezzoRepository.findById(body.mezzoId())
                    .orElseThrow(() -> new NotFound("Mezzo non trovato: " + body.mezzoId()));
        }

        Scadenza nuovaScadenza = new Scadenza(
                body.titolo(),
                body.descrizione(),
                body.dataScadenza(),
                body.tipo(),
                body.stato(),
                mezzo
        );

        return this.scadenzaRepository.save(nuovaScadenza);
    }

    public Page<Scadenza> findAll(int page, int size, String sortBy) {
        if (size > 100 || size <= 0) size = 10;
        if (page < 0) page = 0;

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return this.scadenzaRepository.findAll(pageable);
    }

    public Scadenza findById(UUID id) {
        return this.scadenzaRepository.findById(id)
                .orElseThrow(() -> new NotFound("Scadenza non trovata: " + id));
    }

    public Scadenza findByIdAndUpdate(UUID id, ScadenzaDTO body) {

        Scadenza trovata = this.findById(id);

        Mezzo mezzo = null;

        if (body.mezzoId() != null) {
            mezzo = this.mezzoRepository.findById(body.mezzoId())
                    .orElseThrow(() -> new NotFound("Mezzo non trovato: " + body.mezzoId()));
        }

        trovata.setTitolo(body.titolo());
        trovata.setDescrizione(body.descrizione());
        trovata.setDataScadenza(body.dataScadenza());
        trovata.setTipo(body.tipo());
        trovata.setStato(body.stato());
        trovata.setMezzo(mezzo);

        return this.scadenzaRepository.save(trovata);
    }

    public void findByIdAndDelete(UUID id) {
        Scadenza trovata = this.findById(id);
        this.scadenzaRepository.delete(trovata);
    }

    public List<Scadenza> findByMezzoId(UUID mezzoId) {
        return this.scadenzaRepository.findByMezzoId(mezzoId);
    }

    public List<Scadenza> findScadute() {
        return this.scadenzaRepository.findByDataScadenzaBefore(LocalDate.now());
    }

    public List<Scadenza> findImminenti() {
        LocalDate oggi = LocalDate.now();
        LocalDate tra30Giorni = oggi.plusDays(30);

        return this.scadenzaRepository.findByDataScadenzaBetween(oggi, tra30Giorni);
    }

    public Scadenza creaScadenzaAutomatica(
            String titolo,
            String descrizione,
            LocalDate dataScadenza,
            TipoScadenza tipo,
            Mezzo mezzo
    ) {
        Scadenza scadenza = new Scadenza(
                titolo,
                descrizione,
                dataScadenza,
                tipo,
                StatoScadenza.DA_FARE,
                mezzo
        );

        return this.scadenzaRepository.save(scadenza);
    }

    public Scadenza aggiornaScadenzaAutomatica(
            String titolo,
            String descrizione,
            LocalDate nuovaDataScadenza,
            TipoScadenza tipo,
            Mezzo mezzo
    ) {
        Scadenza scadenza = this.scadenzaRepository
                .findByMezzoIdAndTipo(mezzo.getId(), tipo)
                .orElseThrow(() -> new NotFound("Scadenza " + tipo + " non trovata per il mezzo " + mezzo.getTarga()));

        scadenza.setTitolo(titolo);
        scadenza.setDescrizione(descrizione);
        scadenza.setDataScadenza(nuovaDataScadenza);
        scadenza.setTipo(tipo);
        scadenza.setMezzo(mezzo);

        return this.scadenzaRepository.save(scadenza);
    }
}