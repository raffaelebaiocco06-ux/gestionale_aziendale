package gestionale.aziendale.repository;

import gestionale.aziendale.entities.Scadenza;
import gestionale.aziendale.enumm.StatoScadenza;
import gestionale.aziendale.enumm.TipoScadenza;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ScadenzaRepository extends JpaRepository<Scadenza, UUID> {

    List<Scadenza> findByMezzoId(UUID mezzoId);

    List<Scadenza> findByStato(StatoScadenza stato);

    List<Scadenza> findByTipo(TipoScadenza tipo);

    List<Scadenza> findByDataScadenzaBefore(LocalDate data);

    List<Scadenza> findByDataScadenzaBetween(LocalDate start, LocalDate end);

    Optional<Scadenza> findByMezzoIdAndTipo(UUID mezzoId, TipoScadenza tipo);

    List<Scadenza> findByDataScadenza(LocalDate dataScadenza);
}
