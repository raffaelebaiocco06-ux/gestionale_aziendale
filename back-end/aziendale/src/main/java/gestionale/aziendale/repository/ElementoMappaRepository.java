package gestionale.aziendale.repository;

import gestionale.aziendale.entities.ElementoMappa;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ElementoMappaRepository extends JpaRepository<ElementoMappa, UUID> {

    List<ElementoMappa> findByMappaFieraId(UUID mappaFieraId);
}
