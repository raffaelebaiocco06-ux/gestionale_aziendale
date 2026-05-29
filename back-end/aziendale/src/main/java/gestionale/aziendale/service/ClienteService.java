package gestionale.aziendale.service;

import gestionale.aziendale.entities.Cliente;
import gestionale.aziendale.entities.Utente;
import gestionale.aziendale.exception.BadRequEx;
import gestionale.aziendale.exception.NotFound;
import gestionale.aziendale.payload.ClienteDTO;
import gestionale.aziendale.repository.ClienteRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final CurrentUserService currentUserService;

    public ClienteService(
            ClienteRepository clienteRepository,
            CurrentUserService currentUserService
    ) {
        this.clienteRepository = clienteRepository;
        this.currentUserService = currentUserService;
    }

    public Cliente save(ClienteDTO body) {
        Utente utente = currentUserService.getUtenteLoggato();

        if (clienteRepository.existsByEmailAndUtenteId(body.email(), utente.getId())) {
            throw new BadRequEx("L'email " + body.email() + " è già in uso!");
        }

        if (clienteRepository.existsByPartitaIvaAndUtenteId(body.partitaIva(), utente.getId())) {
            throw new BadRequEx("La partita IVA " + body.partitaIva() + " è già in uso!");
        }

        if (clienteRepository.existsByCodiceFiscaleAndUtenteId(body.codiceFiscale(), utente.getId())) {
            throw new BadRequEx("Il codice fiscale " + body.codiceFiscale() + " è già in uso!");
        }

        Cliente nuovoCliente = new Cliente(
                body.nome(),
                body.partitaIva(),
                body.codiceFiscale(),
                body.telefono(),
                body.email(),
                body.indirizzo(),
                body.citta()
        );

        nuovoCliente.setUtente(utente);

        return clienteRepository.save(nuovoCliente);
    }

    public Page<Cliente> findAll(int page, int size, String sortBy) {
        if (size > 100 || size <= 0) size = 10;
        if (page < 0) page = 0;

        Utente utente = currentUserService.getUtenteLoggato();

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));

        return clienteRepository.findByUtenteId(utente.getId(), pageable);
    }

    public Cliente findById(UUID id) {
        Utente utente = currentUserService.getUtenteLoggato();

        return clienteRepository.findByIdAndUtenteId(id, utente.getId())
                .orElseThrow(() -> new NotFound("Cliente con id " + id + " non trovato"));
    }

    public Cliente findByIdAndUpdate(UUID id, ClienteDTO body) {
        Utente utente = currentUserService.getUtenteLoggato();

        Cliente trovato = findById(id);

        if (!trovato.getEmail().equalsIgnoreCase(body.email())) {
            if (clienteRepository.existsByEmailAndUtenteId(body.email(), utente.getId())) {
                throw new BadRequEx("L'email " + body.email() + " è già in uso!");
            }
        }

        if (!trovato.getPartitaIva().equalsIgnoreCase(body.partitaIva())) {
            if (clienteRepository.existsByPartitaIvaAndUtenteId(body.partitaIva(), utente.getId())) {
                throw new BadRequEx("La partita IVA " + body.partitaIva() + " è già in uso!");
            }
        }

        if (!trovato.getCodiceFiscale().equalsIgnoreCase(body.codiceFiscale())) {
            if (clienteRepository.existsByCodiceFiscaleAndUtenteId(body.codiceFiscale(), utente.getId())) {
                throw new BadRequEx("Il codice fiscale " + body.codiceFiscale() + " è già in uso!");
            }
        }

        trovato.setNome(body.nome());
        trovato.setPartitaIva(body.partitaIva());
        trovato.setCodiceFiscale(body.codiceFiscale());
        trovato.setTelefono(body.telefono());
        trovato.setEmail(body.email());
        trovato.setIndirizzo(body.indirizzo());
        trovato.setCitta(body.citta());

        return clienteRepository.save(trovato);
    }

    public void findByIdAndDelete(UUID id) {
        Cliente trovato = findById(id);
        clienteRepository.delete(trovato);
    }

    public Cliente findByEmail(String email) {
        Utente utente = currentUserService.getUtenteLoggato();

        return clienteRepository.findByEmailAndUtenteId(email, utente.getId())
                .orElseThrow(() -> new NotFound("Cliente con email " + email + " non trovato"));
    }

    public Cliente findByPartitaIva(String partitaIva) {
        Utente utente = currentUserService.getUtenteLoggato();

        return clienteRepository.findByPartitaIvaAndUtenteId(partitaIva, utente.getId())
                .orElseThrow(() -> new NotFound("Cliente con partita IVA " + partitaIva + " non trovato"));
    }

    public List<Cliente> searchByNome(String nome) {
        Utente utente = currentUserService.getUtenteLoggato();

        return clienteRepository.findByNomeContainingIgnoreCaseAndUtenteId(nome, utente.getId());
    }
}
