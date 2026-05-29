package gestionale.aziendale.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path uploadPath = Paths.get("uploads/mappe");

    public String salvaFile(MultipartFile file) {
        try {
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String nomeOriginale = file.getOriginalFilename();

            if (nomeOriginale == null || nomeOriginale.isBlank()) {
                throw new RuntimeException("Nome file non valido");
            }

            String estensione = "";

            int punto = nomeOriginale.lastIndexOf(".");
            if (punto >= 0) {
                estensione = nomeOriginale.substring(punto);
            }

            String nuovoNomeFile = UUID.randomUUID() + estensione;

            Path destinazione = uploadPath.resolve(nuovoNomeFile);

            Files.copy(file.getInputStream(), destinazione, StandardCopyOption.REPLACE_EXISTING);

            return "/uploads/mappe/" + nuovoNomeFile;

        } catch (IOException e) {
            throw new RuntimeException("Errore durante il salvataggio del file", e);
        }
    }
}
