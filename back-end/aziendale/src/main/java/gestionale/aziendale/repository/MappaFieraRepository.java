package gestionale.aziendale.repository;

import gestionale.aziendale.entities.MappaFiera;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface MappaFieraRepository extends JpaRepository<MappaFiera, UUID> {
}
