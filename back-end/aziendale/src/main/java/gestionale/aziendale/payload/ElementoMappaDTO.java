package gestionale.aziendale.payload;

import gestionale.aziendale.enumm.StatoElementoMappa;
import gestionale.aziendale.enumm.TipoElementoMappa;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ElementoMappaDTO(

        @NotBlank(message = "Il nome è obbligatorio")
        String nome,

        @NotNull(message = "Il tipo elemento è obbligatorio")
        TipoElementoMappa tipo,

        @NotNull(message = "La coordinata X è obbligatoria")
        Double x,

        @NotNull(message = "La coordinata Y è obbligatoria")
        Double y,

        @NotNull(message = "La larghezza è obbligatoria")
        Double larghezza,

        @NotNull(message = "L'altezza è obbligatoria")
        Double altezza,

        @NotBlank(message = "Il colore è obbligatorio")
        String colore,

        @NotNull(message = "Lo stato è obbligatorio")
        StatoElementoMappa stato

) {
}
