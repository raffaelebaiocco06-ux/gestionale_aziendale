package gestionale.aziendale.repository;

import gestionale.aziendale.entities.Mezzo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface MezzoRepository extends JpaRepository<Mezzo, UUID> {

    boolean existsByTargaAndUtenteId(String targa, UUID utenteId);

    Optional<Mezzo> findByIdAndUtenteId(UUID id, UUID utenteId);

    Optional<Mezzo> findByTargaAndUtenteId(String targa, UUID utenteId);

    Page<Mezzo> findByUtenteId(UUID utenteId, Pageable pageable);
    List<Mezzo> findByUtenteId(UUID utenteId);
}