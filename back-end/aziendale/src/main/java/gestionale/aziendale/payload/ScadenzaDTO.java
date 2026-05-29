package gestionale.aziendale.payload;

import gestionale.aziendale.enumm.StatoScadenza;
import gestionale.aziendale.enumm.TipoScadenza;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.UUID;

public record ScadenzaDTO(

        @NotBlank(message = "Il titolo è obbligatorio")
        String titolo,
        @NotBlank(message = "La descrizione è obbligatoria")
        String descrizione,
        @NotNull(message = "La data di scadenza è obbligatoria")
        LocalDate dataScadenza,
        @NotNull(message = "Il tipo di scadenza è obbligatorio")
        TipoScadenza tipo,
        @NotNull(message = "Lo stato della scadenza è obbligatorio")
        StatoScadenza stato,

// qui non metto niente perche teoricamente dovrebbe farlo in automatico
        UUID mezzoId

) {
}
