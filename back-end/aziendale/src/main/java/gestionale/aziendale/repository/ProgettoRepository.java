package gestionale.aziendale.repository;

import gestionale.aziendale.entities.Progetto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface ProgettoRepository extends JpaRepository<Progetto, UUID> {
}
