package gestionale.aziendale.service;

import gestionale.aziendale.entities.Categoria;
import gestionale.aziendale.enumm.TipoCategoria;
import gestionale.aziendale.exception.BadRequEx;
import gestionale.aziendale.exception.NotFound;
import gestionale.aziendale.payload.CategoriaDTO;
import gestionale.aziendale.repository.CategoriaRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    public CategoriaService(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    public Categoria save(CategoriaDTO body) {
        if (this.categoriaRepository.existsByNomeAndTipo(body.nome(), body.tipo())) {
            throw new BadRequEx("La categoria " + body.nome() + " di tipo " + body.tipo() + " è già presente");
        }

        Categoria nuovaCategoria = new Categoria(body.nome(), body.tipo());

        return this.categoriaRepository.save(nuovaCategoria);
    }

    public Page<Categoria> findAll(int page, int size, String sortBy) {
        if (size > 100 || size <= 0) size = 10;
        if (page < 0) page = 0;

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return this.categoriaRepository.findAll(pageable);
    }

    public Categoria findById(UUID id) {
        return this.categoriaRepository.findById(id)
                .orElseThrow(() -> new NotFound("Categoria con id " + id + " non trovata"));
    }

    public Categoria findByIdAndUpdate(UUID id, CategoriaDTO body) {
        Categoria trovata = this.findById(id);

        if (!trovata.getNome().equalsIgnoreCase(body.nome()) || trovata.getTipo() != body.tipo()) {
            if (this.categoriaRepository.existsByNomeAndTipo(body.nome(), body.tipo())) {
                throw new BadRequEx("La categoria " + body.nome() + " di tipo " + body.tipo() + " è già presente");
            }
        }

        trovata.setNome(body.nome());
        trovata.setTipo(body.tipo());

        return this.categoriaRepository.save(trovata);
    }

    public void findByIdAndDelete(UUID id) {
        Categoria trovata = this.findById(id);
        this.categoriaRepository.delete(trovata);
    }

    public List<Categoria> findByTipo(TipoCategoria tipo) {
        return this.categoriaRepository.findByTipo(tipo);
    }

    public List<Categoria> searchByNome(String nome) {
        return this.categoriaRepository.findByNomeContainingIgnoreCase(nome);
    }
}
