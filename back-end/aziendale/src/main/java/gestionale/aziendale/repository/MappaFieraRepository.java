package gestionale.aziendale.repository;

import gestionale.aziendale.entities.MappaFiera;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface MappaFieraRepository extends JpaRepository<MappaFiera, UUID> {

    List<MappaFiera> findByUtenteId(UUID utenteId);

    Optional<MappaFiera> findByIdAndUtenteId(UUID id, UUID utenteId);
}
