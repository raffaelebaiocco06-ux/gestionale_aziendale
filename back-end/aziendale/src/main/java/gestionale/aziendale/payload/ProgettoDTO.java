package gestionale.aziendale.payload;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record ProgettoDTO(

        @NotBlank(message = "Il nome del progetto è obbligatorio")
        String nome,
        @NotNull(message = "La descrizione è obbligatoria")
        String descrizione,

        @NotNull(message = "La data di inizio è obbligatoria")
        LocalDate dataInizio,
        @NotNull(message = "L'anno è obbligatorio")
        LocalDate dataFine,
        @NotNull(message = "Il tipo di stato è obbligatorio")
        String stato,
        @Positive(message = "Il budget deve essere maggiore di zero")
        BigDecimal budget,

        @NotNull(message = "Il cliente è obbligatorio")
        UUID clienteId
) {
}
