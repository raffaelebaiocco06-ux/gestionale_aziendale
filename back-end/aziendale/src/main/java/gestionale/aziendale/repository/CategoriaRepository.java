package gestionale.aziendale.repository;

import gestionale.aziendale.entities.Categoria;
import gestionale.aziendale.enumm.TipoCategoria;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CategoriaRepository extends JpaRepository<Categoria, UUID> {

    boolean existsByNomeAndTipo(String nome, TipoCategoria tipo);

    List<Categoria> findByTipo(TipoCategoria tipo);

    List<Categoria> findByNomeContainingIgnoreCase(String nome);
}