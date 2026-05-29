package gestionale.aziendale.service;

import gestionale.aziendale.entities.*;
import gestionale.aziendale.enumm.TipoMovimento;
import gestionale.aziendale.payload.DashBoardDTO;
import gestionale.aziendale.repository.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class DashBoardService {

    private final MovimentoRepository movimentoRepository;
    private final ClienteRepository clienteRepository;
    private final FornitoreRepository fornitoreRepository;
    private final MezzoRepository mezzoRepository;
    private final ScadenzaRepository scadenzaRepository;
    private final CurrentUserService currentUserService;

    public DashBoardService(
            MovimentoRepository movimentoRepository,
            ClienteRepository clienteRepository,
            FornitoreRepository fornitoreRepository,
            MezzoRepository mezzoRepository,
            ScadenzaRepository scadenzaRepository,
            CurrentUserService currentUserService
    ) {
        this.movimentoRepository = movimentoRepository;
        this.clienteRepository = clienteRepository;
        this.fornitoreRepository = fornitoreRepository;
        this.mezzoRepository = mezzoRepository;
        this.scadenzaRepository = scadenzaRepository;
        this.currentUserService = currentUserService;
    }

    public DashBoardDTO getDashBoard() {
        Utente utente = currentUserService.getUtenteLoggato();

        List<Movimento> listaMovimenti =
                movimentoRepository.findByUtenteId(utente.getId());

        long numeroMovimenti = listaMovimenti.size();

        List<Movimento> listaEntrate = listaMovimenti.stream()
                .filter(movimento -> movimento.getTipo() == TipoMovimento.ENTRATA)
                .toList();

        List<Movimento> listaUscite = listaMovimenti.stream()
                .filter(movimento -> movimento.getTipo() == TipoMovimento.USCITA)
                .toList();

        BigDecimal entrate = listaEntrate.stream()
                .map(Movimento::getImporto)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal uscite = listaUscite.stream()
                .map(Movimento::getImporto)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal utile = entrate.subtract(uscite);

        long numeroClienti =
                clienteRepository.findByUtenteId(utente.getId()).size();

        long numeroFornitori =
                fornitoreRepository.findByUtenteId(utente.getId()).size();

        long numeroMezzi =
                mezzoRepository.findByUtenteId(utente.getId()).size();

        LocalDate oggi = LocalDate.now();
        LocalDate tra30Giorni = oggi.plusDays(30);

        long scadenzeScadute =
                scadenzaRepository.findByDataScadenzaBeforeAndUtenteId(
                        oggi,
                        utente.getId()
                ).size();

        long scadenzeImminenti =
                scadenzaRepository.findByDataScadenzaBetweenAndUtenteId(
                        oggi,
                        tra30Giorni,
                        utente.getId()
                ).size();

        return new DashBoardDTO(
                entrate,
                uscite,
                utile,
                numeroClienti,
                numeroFornitori,
                numeroMezzi,
                numeroMovimenti,
                scadenzeImminenti,
                scadenzeScadute
        );
    }
}
