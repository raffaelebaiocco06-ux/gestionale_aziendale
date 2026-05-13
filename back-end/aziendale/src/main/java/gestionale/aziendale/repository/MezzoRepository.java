package gestionale.aziendale.repository;

import gestionale.aziendale.entities.Mezzo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;
@Repository
public interface MezzoRepository extends JpaRepository<Mezzo, UUID> {
    boolean existsByTarga(String targa);
    Optional<Mezzo> findByTarga(String targa);
}
