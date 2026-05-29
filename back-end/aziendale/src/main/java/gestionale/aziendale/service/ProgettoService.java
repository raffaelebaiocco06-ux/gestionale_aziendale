package gestionale.aziendale.service;

import gestionale.aziendale.entities.Cliente;
import gestionale.aziendale.entities.Progetto;
import gestionale.aziendale.entities.Utente;
import gestionale.aziendale.enumm.StatoProgetto;
import gestionale.aziendale.payload.ProgettoDTO;
import gestionale.aziendale.repository.ProgettoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ProgettoService {

    private final ProgettoRepository progettoRepository;
    private final ClienteService clienteService;
    private final CurrentUserService currentUserService;

    public ProgettoService(
            ProgettoRepository progettoRepository,
            ClienteService clienteService,
            CurrentUserService currentUserService
    ) {
        this.progettoRepository = progettoRepository;
        this.clienteService = clienteService;
        this.currentUserService = currentUserService;
    }

    public List<Progetto> findAll() {
        Utente utente = currentUserService.getUtenteLoggato();
        return progettoRepository.findByUtenteId(utente.getId());
    }

    public Progetto findById(UUID id) {
        Utente utente = currentUserService.getUtenteLoggato();

        return progettoRepository.findByIdAndUtenteId(id, utente.getId())
                .orElseThrow(() -> new RuntimeException("Progetto non trovato"));
    }

    public Progetto salva(ProgettoDTO body) {
        Utente utente = currentUserService.getUtenteLoggato();

        Cliente cliente = null;

        if (body.clienteId() != null) {
            cliente = clienteService.findById(body.clienteId());
        }

        Progetto progetto = new Progetto();

        progetto.setNome(body.nome());
        progetto.setDescrizione(body.descrizione());
        progetto.setDataInizio(body.dataInizio());
        progetto.setDataFine(body.dataFine());
        progetto.setStato(StatoProgetto.valueOf(body.stato()));
        progetto.setBudget(body.budget());
        progetto.setCliente(cliente);
        progetto.setUtente(utente);

        return progettoRepository.save(progetto);
    }

    public Progetto update(UUID id, ProgettoDTO body) {
        Progetto progetto = findById(id);

        Cliente cliente = null;

        if (body.clienteId() != null) {
            cliente = clienteService.findById(body.clienteId());
        }

        progetto.setNome(body.nome());
        progetto.setDescrizione(body.descrizione());
        progetto.setDataInizio(body.dataInizio());
        progetto.setDataFine(body.dataFine());
        progetto.setStato(StatoProgetto.valueOf(body.stato()));
        progetto.setBudget(body.budget());
        progetto.setCliente(cliente);

        return progettoRepository.save(progetto);
    }

    public void delete(UUID id) {
        Progetto progetto = findById(id);
        progettoRepository.delete(progetto);
    }
}
