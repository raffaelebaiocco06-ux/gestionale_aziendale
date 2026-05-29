package gestionale.aziendale.payload;

import gestionale.aziendale.enumm.MetodoPagamento;
import gestionale.aziendale.enumm.StatoPagamento;
import gestionale.aziendale.enumm.TipoMovimento;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record MovimentoDTO(
        @NotNull(message = "La categoria è obbligatoria")
        String categoria,

        UUID clienteId,

        UUID fornitoreId,

        UUID mezzoId,

        @NotNull(message = "Il tipo movimento è obbligatorio")
        TipoMovimento tipo,

        @NotBlank(message = "La descrizione è obbligatoria")
        String descrizione,

        @NotNull(message = "L'importo è obbligatorio")
        @Positive(message = "L'importo deve essere maggiore di zero")
        BigDecimal importo,

        @NotNull(message = "La data del movimento è obbligatoria")
        LocalDate dataMovimento,

        @NotNull(message = "Il metodo di pagamento è obbligatorio")
        MetodoPagamento metodoPagamento,

        @NotNull(message = "Lo stato del pagamento è obbligatorio")
        StatoPagamento stato
) {
}
