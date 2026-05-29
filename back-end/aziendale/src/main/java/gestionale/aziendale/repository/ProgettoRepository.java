package gestionale.aziendale.repository;

import gestionale.aziendale.entities.Progetto;
import gestionale.aziendale.enumm.StatoProgetto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProgettoRepository extends JpaRepository<Progetto, UUID> {

    List<Progetto> findByUtenteId(UUID utenteId);

    Optional<Progetto> findByIdAndUtenteId(UUID id, UUID utenteId);

    List<Progetto> findByStatoAndUtenteId(StatoProgetto stato, UUID utenteId);

    List<Progetto> findByClienteIdAndUtenteId(UUID clienteId, UUID utenteId);
}
