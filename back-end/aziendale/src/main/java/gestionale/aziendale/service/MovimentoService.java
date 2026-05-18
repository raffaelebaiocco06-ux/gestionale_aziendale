package gestionale.aziendale.service;

import gestionale.aziendale.entities.*;
import gestionale.aziendale.exception.BadRequEx;
import gestionale.aziendale.exception.NotFound;
import gestionale.aziendale.payload.MovimentoDTO;
import gestionale.aziendale.repository.MovimentoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.UUID;

public class MovimentoService {
    private final MovimentoRepository movimentoRepository;
    private final CategoriaService categoriaService;
    private final ClienteService clienteService;
    private final FornitoreService fornitoreService;
    private final MezzoService mezzoService;

    public MovimentoService(MovimentoRepository movimentoRepository, CategoriaService categoriaService, ClienteService clienteService, FornitoreService fornitoreService, MezzoService mezzoService) {
        this.movimentoRepository = movimentoRepository;
        this.categoriaService = categoriaService;
        this.clienteService = clienteService;
        this.fornitoreService = fornitoreService;
        this.mezzoService = mezzoService;
    }
    public Movimento save(MovimentoDTO body) {

        Categoria categoria = this.categoriaService.findById(body.categoriaId());

        if (!categoria.getTipo().name().equals(body.tipo().name())) {
            throw new BadRequEx("Il tipo del movimento non corrisponde al tipo della categoria");
        }

        Cliente cliente = null;
        if (body.clienteId() != null) {
            cliente = this.clienteService.findById(body.clienteId());
        }

        Fornitore fornitore = null;
        if (body.fornitoreId() != null) {
            fornitore = this.fornitoreService.findById(body.fornitoreId());
        }

        Mezzo mezzo = null;
        if (body.mezzoId() != null) {
            mezzo = this.mezzoService.findById(body.mezzoId());
        }

        Movimento nuovoMovimento = new Movimento(
                categoria,
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

        return this.movimentoRepository.save(nuovoMovimento);
    }

    public Page<Movimento> findAll(int page, int size, String sortBy) {
        if (size > 100 || size <= 0) size = 10;
        if (page < 0) page = 0;

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return this.movimentoRepository.findAll(pageable);
    }

    public Movimento findById(UUID id) {
        return this.movimentoRepository.findById(id)
                .orElseThrow(() -> new NotFound("Movimento con id " + id + " non trovato"));
    }

    public Movimento findByIdAndUpdate(UUID id, MovimentoDTO body) {

        Movimento trovato = this.findById(id);

        Categoria categoria = this.categoriaService.findById(body.categoriaId());

        if (!categoria.getTipo().name().equals(body.tipo().name())) {
            throw new BadRequEx("Il tipo del movimento non corrisponde al tipo della categoria");
        }

        Cliente cliente = null;
        if (body.clienteId() != null) {
            cliente = this.clienteService.findById(body.clienteId());
        }

        Fornitore fornitore = null;
        if (body.fornitoreId() != null) {
            fornitore = this.fornitoreService.findById(body.fornitoreId());
        }

        Mezzo mezzo = null;
        if (body.mezzoId() != null) {
            mezzo = this.mezzoService.findById(body.mezzoId());
        }

        trovato.setCategoria(categoria);
        trovato.setCliente(cliente);
        trovato.setFornitore(fornitore);
        trovato.setMezzo(mezzo);
        trovato.setTipo(body.tipo());
        trovato.setDescrizione(body.descrizione());
        trovato.setImporto(body.importo());
        trovato.setDataMovimento(body.dataMovimento());
        trovato.setMetodoPagamento(body.metodoPagamento());
        trovato.setStato(body.stato());

        return this.movimentoRepository.save(trovato);
    }

    public void findByIdAndDelete(UUID id) {
        Movimento trovato = this.findById(id);
        this.movimentoRepository.delete(trovato);
    }
}
