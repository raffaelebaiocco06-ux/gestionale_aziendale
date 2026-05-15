package gestionale.aziendale.payload;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record FornitoreDTO(

        @NotBlank(message = "Il nome è obbligatorio")
        String nome,

        @NotBlank(message = "La partita IVA è obbligatoria")
        String partitaIva,

        @NotBlank(message = "Il telefono è obbligatorio")
        String telefono,

        @Email(message = "Email non valida")
        @NotBlank(message = "L'email è obbligatoria")
        String email,

        @NotBlank(message = "L'indirizzo è obbligatorio")
        String indirizzo,

        @NotBlank(message = "La categoria è obbligatoria")
        String categoria

) {
}
