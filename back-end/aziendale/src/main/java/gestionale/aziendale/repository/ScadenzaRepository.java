package gestionale.aziendale.repository;

import gestionale.aziendale.entities.Scadenza;
import gestionale.aziendale.enumm.StatoScadenza;
import gestionale.aziendale.enumm.TipoScadenza;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ScadenzaRepository extends JpaRepository<Scadenza, UUID> {

    List<Scadenza> findByUtenteId(UUID utenteId);

    Page<Scadenza> findByUtenteId(UUID utenteId, Pageable pageable);

    Optional<Scadenza> findByIdAndUtenteId(UUID id, UUID utenteId);

    List<Scadenza> findByStatoAndUtenteId(StatoScadenza stato, UUID utenteId);

    List<Scadenza> findByTipoAndUtenteId(TipoScadenza tipo, UUID utenteId);

    List<Scadenza> findByMezzoIdAndUtenteId(UUID mezzoId, UUID utenteId);

    List<Scadenza> findByDataScadenza(LocalDate dataScadenza);

    List<Scadenza> findByDataScadenzaBeforeAndUtenteId(LocalDate data, UUID utenteId);

    List<Scadenza> findByDataScadenzaBetweenAndUtenteId(LocalDate start, LocalDate end, UUID utenteId);
}