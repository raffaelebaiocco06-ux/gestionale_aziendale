package gestionale.aziendale.repository;

import gestionale.aziendale.entities.Fornitore;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface FornitoreRepository extends JpaRepository<Fornitore, UUID> {

    boolean existsByEmail(String email);

    boolean existsByPartitaIva(String partitaIva);

    Optional<Fornitore> findByEmail(String email);

    Optional<Fornitore> findByPartitaIva(String partitaIva);

    List<Fornitore> findByNomeContainingIgnoreCase(String nome);

    List<Fornitore> findByCategoriaContainingIgnoreCase(String categoria);
}
