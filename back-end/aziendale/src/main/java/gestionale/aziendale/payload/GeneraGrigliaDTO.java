package gestionale.aziendale.payload;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record GeneraGrigliaDTO(

        @NotNull(message = "Le righe sono obbligatorie")
        @Positive(message = "Le righe devono essere maggiori di zero")
        Integer righe,

        @NotNull(message = "Le colonne sono obbligatorie")
        @Positive(message = "Le colonne devono essere maggiori di zero")
        Integer colonne,

        @NotNull(message = "X iniziale obbligatoria")
        Double xIniziale,

        @NotNull(message = "Y iniziale obbligatoria")
        Double yIniziale,

        @NotNull(message = "La larghezza è obbligatoria")
        Double larghezza,

        @NotNull(message = "L'altezza è obbligatoria")
        Double altezza,

        @NotNull(message = "Lo spazio X è obbligatorio")
        Double spazioX,

        @NotNull(message = "Lo spazio Y è obbligatorio")
        Double spazioY

) {
}
