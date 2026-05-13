package gestionale.aziendale.service;

import gestionale.aziendale.entities.Utente;
import gestionale.aziendale.exception.BadRequEx;
import gestionale.aziendale.exception.NotFound;
import gestionale.aziendale.login.UtenteDTO;
import gestionale.aziendale.repository.UtenteRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UtenteService {


    private final UtenteRepository utenteRepository;
    private final PasswordEncoder bcrypt;

    public UtenteService(UtenteRepository utenteRepository, PasswordEncoder bcrypt) {
        this.utenteRepository = utenteRepository;
        this.bcrypt = bcrypt;
    }

    public Utente save(UtenteDTO body){
        if(this.utenteRepository.existsByEmail(body.email())) throw new BadRequEx("L'indirizzo email " + body.email() + " è già in uso!");
        Utente nuovoUtente= new Utente(body.nome(),body.cognome(),body.email(),this.bcrypt.encode(body.password()));
        return utenteRepository.save(nuovoUtente);
    }

    public Page<Utente> findAll(int page, int size, String sortBy) {
        if (size > 100 || size < 0) size = 10;
        if (page < 0) page = 0;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return this.utenteRepository.findAll(pageable);
    }
    public Utente findById(UUID id){
        return this.utenteRepository.findById(id).orElseThrow(()-> new NotFound("Utente con id "+ id + " non e stato trovato"));
    }

    public void findByIdAndDelete(UUID userId) {
        Utente trovato= this.findById(userId);
        this.utenteRepository.delete(trovato);
    }
    public Utente findByEmail(String email){
        return this.utenteRepository.findByEmail(email).orElseThrow(()->new NotFound("Utente con email "+ email + " non e stato trovato"));
    }
    public Utente findByIdAndUpdate(UUID id, UtenteDTO body){
        Utente trovato= this.findById(id);
        if(!trovato.getEmail().equals(body.email())){
            if(this.utenteRepository.existsByEmail(body.email())) throw new BadRequEx("L'indirizzo email " + body.email() + " è già in uso!");
        }

        trovato.setNome(body.nome());
        trovato.setCognome(body.cognome());
        trovato.setEmail(body.email());
        trovato.setPassword(body.password());
        Utente nuovo= this.utenteRepository.save(trovato);
        return nuovo;
    }
}
