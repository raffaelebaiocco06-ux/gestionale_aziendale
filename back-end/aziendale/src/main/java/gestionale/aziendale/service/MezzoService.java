package gestionale.aziendale.service;


import gestionale.aziendale.entities.Mezzo;
import gestionale.aziendale.entities.Utente;
import gestionale.aziendale.enumm.TipoScadenza;
import gestionale.aziendale.exception.BadRequEx;
import gestionale.aziendale.exception.NotFound;
import gestionale.aziendale.payload.MezzoDTO;
import gestionale.aziendale.repository.MezzoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class MezzoService {
    private final MezzoRepository mezzoRepository;
    private final ScadenzaService scadenzaService;

    public MezzoService(MezzoRepository mezzoRepository, ScadenzaService scadenzaService) {
        this.mezzoRepository = mezzoRepository;
        this.scadenzaService = scadenzaService;
    }

    public Mezzo save(MezzoDTO body){
        if(this.mezzoRepository.existsByTarga(body.targa())) throw new BadRequEx("la targa " + body.targa() + " è già in uso!");
        Utente utenteLoggato = (Utente) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Mezzo nuovoMezzo= new Mezzo(body.targa(), body.marca(), body.modello(),body.tipo(), body.anno(), body.assicurazioneScadenza(),body.bolloScadenza(),body.revisioneScadenza());
        nuovoMezzo.setUtente(utenteLoggato);
        Mezzo mezzoSalvato = this.mezzoRepository.save(nuovoMezzo);

        // qua devo salvare 3 tipi di scadenze co i metodi del service
        scadenzaService.creaScadenzaAutomatica("Assicurazione "+mezzoSalvato.getTarga(),   "Scadenza assicurazione del mezzo " + mezzoSalvato.getMarca() + " " + mezzoSalvato.getModello(), mezzoSalvato.getAssicurazioneScadenza(), TipoScadenza.ASSICURAZIONE,mezzoSalvato);
        scadenzaService.creaScadenzaAutomatica("Bollo " + mezzoSalvato.getTarga(), "Scadenza bollo del mezzo " + mezzoSalvato.getMarca() + " " + mezzoSalvato.getModello(), mezzoSalvato.getBolloScadenza(), TipoScadenza.BOLLO, mezzoSalvato);
        scadenzaService.creaScadenzaAutomatica("Revisione " + mezzoSalvato.getTarga(),"Scadenza revisione del mezzo " + mezzoSalvato.getMarca() + " " + mezzoSalvato.getModello(), mezzoSalvato.getRevisioneScadenza(), TipoScadenza.REVISIONE, mezzoSalvato);

        return mezzoSalvato;
    }
    public Page<Mezzo> findAll(int page, int size, String sortBy) {
        if (size > 100 || size < 0) size = 10;
        if (page < 0) page = 0;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return this.mezzoRepository.findAll(pageable);
    }
    public Mezzo findById(UUID Id) {
        return this.mezzoRepository.findById(Id).orElseThrow(() -> new NotFound("Mezzo non trovato: "+ Id));
    }
    public Mezzo findByIdAndUpdate(UUID Id, MezzoDTO body){

        Mezzo trovato= this.findById(Id);
        if(!trovato.getTarga().equals(body.targa())){
            if(this.mezzoRepository.existsByTarga(body.targa())) throw new BadRequEx("la Targa "+ body.targa()+"e' gia' in uso");
        }
        trovato.setTarga(body.targa());
        trovato.setMarca(body.marca());
        trovato.setModello(body.modello());
        trovato.setTipo(body.tipo());
        trovato.setAnno(body.anno());
        trovato.setAssicurazioneScadenza(body.assicurazioneScadenza());
        trovato.setBolloScadenza(body.bolloScadenza());
        trovato.setRevisioneScadenza(body.revisioneScadenza());

        Mezzo mezzoSalvato = this.mezzoRepository.save(trovato);

        //lo devo rifare anche qua visto che le scadenze potrebbero cambiare
        scadenzaService.aggiornaScadenzaAutomatica("Assicurazione " + mezzoSalvato.getTarga(), "Scadenza assicurazione del mezzo " + mezzoSalvato.getMarca() + " " + mezzoSalvato.getModello(), mezzoSalvato.getAssicurazioneScadenza(), TipoScadenza.ASSICURAZIONE, mezzoSalvato);

        scadenzaService.aggiornaScadenzaAutomatica("Bollo " + mezzoSalvato.getTarga(), "Scadenza bollo del mezzo " + mezzoSalvato.getMarca() + " " + mezzoSalvato.getModello(), mezzoSalvato.getBolloScadenza(), TipoScadenza.BOLLO, mezzoSalvato);

        scadenzaService.aggiornaScadenzaAutomatica("Revisione " + mezzoSalvato.getTarga(), "Scadenza revisione del mezzo " + mezzoSalvato.getMarca() + " " + mezzoSalvato.getModello(), mezzoSalvato.getRevisioneScadenza(), TipoScadenza.REVISIONE, mezzoSalvato);

        return mezzoSalvato;
    }
    public void findByIdAndDelete(UUID Id) {
        Mezzo trovato = this.findById(Id);
        this.mezzoRepository.delete(trovato);
    }

    public Mezzo findByTarga(String targa){
        return this.mezzoRepository.findByTarga(targa).orElseThrow( ()-> new NotFound("la Targa "+ targa +"non c'e'"));
    }
}
