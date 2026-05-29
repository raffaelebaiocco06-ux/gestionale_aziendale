package gestionale.aziendale.repository;

import gestionale.aziendale.entities.Cliente;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ClienteRepository extends JpaRepository<Cliente, UUID> {

    boolean existsByEmailAndUtenteId(String email, UUID utenteId);

    boolean existsByPartitaIvaAndUtenteId(String partitaIva, UUID utenteId);

    boolean existsByCodiceFiscaleAndUtenteId(String codiceFiscale, UUID utenteId);

    Optional<Cliente> findByIdAndUtenteId(UUID id, UUID utenteId);

    Optional<Cliente> findByEmailAndUtenteId(String email, UUID utenteId);

    Optional<Cliente> findByPartitaIvaAndUtenteId(String partitaIva, UUID utenteId);

    Page<Cliente> findByUtenteId(UUID utenteId, Pageable pageable);

    List<Cliente> findByNomeContainingIgnoreCaseAndUtenteId(String nome, UUID utenteId);
    List<Cliente> findByUtenteId(UUID utenteId);
}