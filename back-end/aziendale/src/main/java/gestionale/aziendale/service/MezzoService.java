package gestionale.aziendale.service;


import gestionale.aziendale.entities.Mezzo;
import gestionale.aziendale.exception.BadRequEx;
import gestionale.aziendale.exception.NotFound;
import gestionale.aziendale.payload.MezzoDTO;
import gestionale.aziendale.repository.MezzoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class MezzoService {
    private final MezzoRepository mezzoRepository;

    public MezzoService(MezzoRepository mezzoRepository) {
        this.mezzoRepository = mezzoRepository;
    }
    public Mezzo save(MezzoDTO body){
        if(this.mezzoRepository.existsByTarga(body.targa())) throw new BadRequEx("la targa " + body.targa() + " è già in uso!");
        Mezzo nuovoMezzo= new Mezzo(body.targa(), body.marca(), body.modello(),body.tipo(), body.anno(), body.assicurazioneScadenza(),body.bolloScadenza(),body.revisioneScadenza());
        return nuovoMezzo;
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

        Mezzo nuovo = this.mezzoRepository.save(trovato);
        return nuovo;
    }
    public void findByIdAndDelete(UUID Id) {
        Mezzo trovato = this.findById(Id);
        this.mezzoRepository.delete(trovato);
    }

    public Mezzo findByTarga(String targa){
        return this.mezzoRepository.findByTarga(targa).orElseThrow( ()-> new NotFound("la Targa "+ targa +"non c'e'"));
    }
}
