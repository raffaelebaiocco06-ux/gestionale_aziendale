package gestionale.aziendale.service;


import gestionale.aziendale.entities.Mezzo;
import gestionale.aziendale.payload.MezzoDTO;
import gestionale.aziendale.repository.MezzoRepository;
import org.springframework.stereotype.Service;

@Service
public class MezzoService {
    private final MezzoRepository mezzoRepository;

    public MezzoService(MezzoRepository mezzoRepository) {
        this.mezzoRepository = mezzoRepository;
    }
    public Mezzo save(MezzoDTO body){
        if(this.mezzoRepository.existsByTarga(body.targa())) throw new 
    }
}
