package gestionale.aziendale.payload;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record MappaFieraDTO(

        @NotBlank(message = "Il nome della mappa è obbligatorio")
        String nome,

        @NotBlank(message = "Il fileUrl è obbligatorio")
        String fileUrl,

        @NotNull(message = "La larghezza originale è obbligatoria")
        Integer larghezzaOriginale,

        @NotNull(message = "L'altezza originale è obbligatoria")
        Integer altezzaOriginale

) {
}
