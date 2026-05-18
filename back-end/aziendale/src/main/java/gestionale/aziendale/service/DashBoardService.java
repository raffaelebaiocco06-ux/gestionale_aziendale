package gestionale.aziendale.service;

import gestionale.aziendale.entities.Cliente;
import gestionale.aziendale.entities.Fornitore;
import gestionale.aziendale.entities.Mezzo;
import gestionale.aziendale.entities.Movimento;
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

    public DashBoardService(MovimentoRepository movimentoRepository, ClienteRepository clienteRepository, FornitoreRepository fornitoreRepository, MezzoRepository mezzoRepository, ScadenzaRepository scadenzaRepository) {
        this.movimentoRepository = movimentoRepository;
        this.clienteRepository = clienteRepository;
        this.fornitoreRepository = fornitoreRepository;
        this.mezzoRepository = mezzoRepository;
        this.scadenzaRepository = scadenzaRepository;
    }
public DashBoardDTO getDashBoard(){
    List<Movimento> listamovimenti=movimentoRepository.findAll();
    long numeromovimenti= listamovimenti.size();
    List<Movimento> listaentrate= listamovimenti.stream().filter(e-> e.getTipo() == TipoMovimento.ENTRATA).toList();
    List<Movimento> listauscite= listamovimenti.stream().filter(e-> e.getTipo() == TipoMovimento.USCITA).toList();
    BigDecimal entrate = listaentrate.stream().map(Movimento::getImporto).reduce(BigDecimal.ZERO, BigDecimal::add);
    BigDecimal uscite = listauscite.stream().map(Movimento::getImporto).reduce(BigDecimal.ZERO, BigDecimal::add);
    BigDecimal utile= entrate.subtract(uscite);
    List<Cliente> listaclienti=clienteRepository.findAll();
    long numeroclienti= listaclienti.size();
    List<Fornitore> listafotnitori=fornitoreRepository.findAll();
    long numerofornitori= listafotnitori.size();
    List<Mezzo> listam=mezzoRepository.findAll();
    long numeromezzi= listam.size();

    LocalDate oggi = LocalDate.now();
    LocalDate tra30Giorni = oggi.plusDays(30);
    long scadenzeScadute = scadenzaRepository.findByDataScadenzaBefore(oggi).size();
    long scadenzeImminenti = scadenzaRepository.findByDataScadenzaBetween(oggi, tra30Giorni).size();

    return new DashBoardDTO(entrate, uscite, utile, numeroclienti, numerofornitori, numeromezzi, numeromovimenti, scadenzeImminenti, scadenzeScadute);

}
}
