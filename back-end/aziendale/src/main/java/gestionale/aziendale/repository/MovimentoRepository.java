package gestionale.aziendale.repository;

import gestionale.aziendale.entities.Movimento;
import gestionale.aziendale.enumm.StatoPagamento;
import gestionale.aziendale.enumm.TipoMovimento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface MovimentoRepository extends JpaRepository<Movimento, UUID> {

    List<Movimento> findByTipo(TipoMovimento tipo);

    List<Movimento> findByStato(StatoPagamento stato);

    List<Movimento> findByCategoriaId(UUID categoriaId);

    List<Movimento> findByClienteId(UUID clienteId);

    List<Movimento> findByFornitoreId(UUID fornitoreId);

    List<Movimento> findByMezzoId(UUID mezzoId);

    List<Movimento> findByDataMovimentoBetween(LocalDate start, LocalDate end);

    List<Movimento> findByTipoAndDataMovimentoBetween(
            TipoMovimento tipo,
            LocalDate start,
            LocalDate end
    );
}
