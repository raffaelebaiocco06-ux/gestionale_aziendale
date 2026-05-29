package gestionale.aziendale.repository;

import gestionale.aziendale.entities.Movimento;
import gestionale.aziendale.enumm.StatoPagamento;
import gestionale.aziendale.enumm.TipoMovimento;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MovimentoRepository extends JpaRepository<Movimento, UUID> {

    Page<Movimento> findByUtenteId(UUID utenteId, Pageable pageable);

    Optional<Movimento> findByIdAndUtenteId(UUID id, UUID utenteId);

    List<Movimento> findByTipoAndUtenteId(TipoMovimento tipo, UUID utenteId);

    List<Movimento> findByStatoAndUtenteId(StatoPagamento stato, UUID utenteId);

    List<Movimento> findByCategoriaIdAndUtenteId(UUID categoriaId, UUID utenteId);

    List<Movimento> findByClienteIdAndUtenteId(UUID clienteId, UUID utenteId);

    List<Movimento> findByFornitoreIdAndUtenteId(UUID fornitoreId, UUID utenteId);

    List<Movimento> findByMezzoIdAndUtenteId(UUID mezzoId, UUID utenteId);
    List<Movimento> findByUtenteId(UUID utenteId);

    List<Movimento> findByDataMovimentoBetweenAndUtenteId(
            LocalDate start,
            LocalDate end,
            UUID utenteId
    );

    List<Movimento> findByTipoAndDataMovimentoBetweenAndUtenteId(
            TipoMovimento tipo,
            LocalDate start,
            LocalDate end,
            UUID utenteId
    );
}
