package gestionale.aziendale.service;

import gestionale.aziendale.entities.*;
import gestionale.aziendale.exception.NotFound;
import gestionale.aziendale.payload.MovimentoDTO;
import gestionale.aziendale.repository.MovimentoRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class MovimentoService {

    private final MovimentoRepository movimentoRepository;
    private final ClienteService clienteService;
    private final FornitoreService fornitoreService;
    private final MezzoService mezzoService;
    private final CurrentUserService currentUserService;

    public MovimentoService(
            MovimentoRepository movimentoRepository,
            ClienteService clienteService,
            FornitoreService fornitoreService,
            MezzoService mezzoService,
            CurrentUserService currentUserService
    ) {
        this.movimentoRepository = movimentoRepository;
        this.clienteService = clienteService;
        this.fornitoreService = fornitoreService;
        this.mezzoService = mezzoService;
        this.currentUserService = currentUserService;
    }

    public Movimento save(MovimentoDTO body) {

        Utente utente = currentUserService.getUtenteLoggato();

        Cliente cliente = null;
        if (body.clienteId() != null) {
            cliente = clienteService.findById(body.clienteId());
        }

        Fornitore fornitore = null;
        if (body.fornitoreId() != null) {
            fornitore = fornitoreService.findById(body.fornitoreId());
        }

        Mezzo mezzo = null;
        if (body.mezzoId() != null) {
            mezzo = mezzoService.findById(body.mezzoId());
        }

        Movimento nuovoMovimento = new Movimento(
                body.categoria(),
                cliente,
                fornitore,
                mezzo,
                body.tipo(),
                body.descrizione(),
                body.importo(),
                body.dataMovimento(),
                body.metodoPagamento(),
                body.stato()
        );

        nuovoMovimento.setUtente(utente);

        return movimentoRepository.save(nuovoMovimento);
    }

    public Page<Movimento> findAll(int page, int size, String sortBy) {

        if (size > 100 || size <= 0) size = 10;
        if (page < 0) page = 0;

        Utente utente = currentUserService.getUtenteLoggato();

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(sortBy)
        );

        return movimentoRepository.findByUtenteId(
                utente.getId(),
                pageable
        );
    }

    public Movimento findById(UUID id) {

        Utente utente = currentUserService.getUtenteLoggato();

        return movimentoRepository
                .findByIdAndUtenteId(id, utente.getId())
                .orElseThrow(() ->
                        new NotFound("Movimento con id " + id + " non trovato"));
    }

    public Movimento findByIdAndUpdate(UUID id, MovimentoDTO body) {

        Movimento trovato = findById(id);

        Cliente cliente = null;
        if (body.clienteId() != null) {
            cliente = clienteService.findById(body.clienteId());
        }

        Fornitore fornitore = null;
        if (body.fornitoreId() != null) {
            fornitore = fornitoreService.findById(body.fornitoreId());
        }

        Mezzo mezzo = null;
        if (body.mezzoId() != null) {
            mezzo = mezzoService.findById(body.mezzoId());
        }

        trovato.setCategoria(body.categoria());
        trovato.setCliente(cliente);
        trovato.setFornitore(fornitore);
        trovato.setMezzo(mezzo);
        trovato.setTipo(body.tipo());
        trovato.setDescrizione(body.descrizione());
        trovato.setImporto(body.importo());
        trovato.setDataMovimento(body.dataMovimento());
        trovato.setMetodoPagamento(body.metodoPagamento());
        trovato.setStato(body.stato());

        return movimentoRepository.save(trovato);
    }

    public void findByIdAndDelete(UUID id) {
        Movimento trovato = findById(id);
        movimentoRepository.delete(trovato);
    }
}