package gestionale.aziendale.service;


import gestionale.aziendale.entities.Cliente;
import gestionale.aziendale.entities.Progetto;
import gestionale.aziendale.payload.ProgettoDTO;
import gestionale.aziendale.repository.ClienteRepository;
import gestionale.aziendale.repository.ProgettoRepository;
import org.springframework.stereotype.Service;
import gestionale.aziendale.enumm.StatoProgetto;

import java.util.List;
import java.util.UUID;

@Service
public class ProgettoService {

    private final ProgettoRepository progettoRepository;
    private final ClienteRepository clienteRepository;

    public ProgettoService(ProgettoRepository progettoRepository, ClienteRepository clienteRepository) {
        this.progettoRepository = progettoRepository;
        this.clienteRepository = clienteRepository;
    }

    public List<Progetto> findAll() {
        return progettoRepository.findAll();
    }

    public Progetto findById(UUID id) {
        return progettoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Progetto non trovato"));
    }

    public Progetto salva(ProgettoDTO body) {

        Progetto progetto = new Progetto();

        progetto.setNome(body.nome());
        progetto.setDescrizione(body.descrizione());
        progetto.setDataInizio(body.dataInizio());
        progetto.setDataFine(body.dataFine());
        progetto.setStato(StatoProgetto.valueOf(body.stato()));
        progetto.setBudget(body.budget());

        if (body.clienteId() != null) {
            Cliente cliente = clienteRepository.findById(body.clienteId())
                    .orElseThrow(() -> new RuntimeException("Cliente non trovato"));

            progetto.setCliente(cliente);
        }

        return progettoRepository.save(progetto);
    }

    public Progetto update(UUID id, ProgettoDTO body) {

        Progetto progetto = findById(id);

        progetto.setNome(body.nome());
        progetto.setDescrizione(body.descrizione());
        progetto.setDataInizio(body.dataInizio());
        progetto.setDataFine(body.dataFine());
        progetto.setStato(StatoProgetto.valueOf(body.stato()));
        progetto.setBudget(body.budget());

        if (body.clienteId() != null) {
            Cliente cliente = clienteRepository.findById(body.clienteId())
                    .orElseThrow(() -> new RuntimeException("Cliente non trovato"));

            progetto.setCliente(cliente);
        } else {
            progetto.setCliente(null);
        }

        return progettoRepository.save(progetto);
    }

    public void delete(UUID id) {
        progettoRepository.deleteById(id);
    }
}
