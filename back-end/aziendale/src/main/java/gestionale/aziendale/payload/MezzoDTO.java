package gestionale.aziendale.payload;

import gestionale.aziendale.enumm.TipoMezzo;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record MezzoDTO(
        @NotBlank(message = "La targa è obbligatoria")
        String targa,

        @NotBlank(message = "La marca è obbligatoria")
        String marca,

        @NotBlank(message = "Il modello è obbligatorio")
        String modello,

        @NotNull(message = "Il tipo del mezzo è obbligatorio")
        TipoMezzo tipo,

        @NotNull(message = "L'anno è obbligatorio")
        Integer anno,

        @NotNull(message = "La scadenza assicurazione è obbligatoria")
        LocalDate assicurazioneScadenza,

        @NotNull(message = "La scadenza bollo è obbligatoria")
        LocalDate bolloScadenza,

        @NotNull(message = "La scadenza revisione è obbligatoria")
        LocalDate revisioneScadenza

) {
}
