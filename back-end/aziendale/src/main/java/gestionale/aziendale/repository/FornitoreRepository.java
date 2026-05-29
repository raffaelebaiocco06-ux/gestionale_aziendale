package gestionale.aziendale.repository;

import gestionale.aziendale.entities.Fornitore;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface FornitoreRepository extends JpaRepository<Fornitore, UUID> {

    boolean existsByEmailAndUtenteId(String email, UUID utenteId);

    boolean existsByPartitaIvaAndUtenteId(String partitaIva, UUID utenteId);

    Optional<Fornitore> findByIdAndUtenteId(UUID id, UUID utenteId);

    Optional<Fornitore> findByEmailAndUtenteId(String email, UUID utenteId);

    Optional<Fornitore> findByPartitaIvaAndUtenteId(String partitaIva, UUID utenteId);

    Page<Fornitore> findByUtenteId(UUID utenteId, Pageable pageable);

    List<Fornitore> findByNomeContainingIgnoreCaseAndUtenteId(String nome, UUID utenteId);

    List<Fornitore> findByCategoriaContainingIgnoreCaseAndUtenteId(String categoria, UUID utenteId);
    List<Fornitore> findByUtenteId(UUID utenteId);
}
