package gestionale.aziendale.service;

import gestionale.aziendale.entities.MappaFiera;
import gestionale.aziendale.payload.MappaFieraDTO;
import gestionale.aziendale.repository.MappaFieraRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Service
public class MappaFieraService {

    private final MappaFieraRepository mappaFieraRepository;
    private final FileStorageService fileStorageService;

    public MappaFieraService(
            MappaFieraRepository mappaFieraRepository,
            FileStorageService fileStorageService
    ) {
        this.mappaFieraRepository = mappaFieraRepository;
        this.fileStorageService = fileStorageService;
    }

    public MappaFiera creaMappa(MappaFieraDTO dto) {

        MappaFiera mappa = new MappaFiera();

        mappa.setNome(dto.nome());
        mappa.setFileUrl(dto.fileUrl());
        mappa.setLarghezzaOriginale(dto.larghezzaOriginale());
        mappa.setAltezzaOriginale(dto.altezzaOriginale());

        return mappaFieraRepository.save(mappa);
    }

    public MappaFiera creaMappaConFile(String nome, MultipartFile file, Integer larghezzaOriginale, Integer altezzaOriginale) {

        String fileUrl = fileStorageService.salvaFile(file);

        MappaFiera mappa = new MappaFiera();

        mappa.setNome(nome);
        mappa.setFileUrl(fileUrl);
        mappa.setLarghezzaOriginale(larghezzaOriginale);
        mappa.setAltezzaOriginale(altezzaOriginale);

        return mappaFieraRepository.save(mappa);
    }

    public List<MappaFiera> trovaTutte() {
        return mappaFieraRepository.findAll();
    }

    public MappaFiera trovaPerId(UUID id) {
        return mappaFieraRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mappa fiera non trovata"));
    }

    public MappaFiera aggiornaMappa(UUID id, MappaFieraDTO dto) {

        MappaFiera mappa = trovaPerId(id);

        mappa.setNome(dto.nome());
        mappa.setFileUrl(dto.fileUrl());
        mappa.setLarghezzaOriginale(dto.larghezzaOriginale());
        mappa.setAltezzaOriginale(dto.altezzaOriginale());

        return mappaFieraRepository.save(mappa);
    }

    public void eliminaMappa(UUID id) {

        MappaFiera mappa = trovaPerId(id);

        mappaFieraRepository.delete(mappa);
    }
}