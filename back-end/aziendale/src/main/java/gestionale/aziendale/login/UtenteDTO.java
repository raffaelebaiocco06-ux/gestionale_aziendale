package gestionale.aziendale.login;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UtenteDTO (
        @NotBlank(message = "Il nome proprio è obbligatorio e non può essere una stringa vuota")
        @Size(min = 2, max = 30, message = "Il nome proprio deve essere compreso tra i 2 e i 30 caratteri")
        String nome,
        @NotBlank(message = "Il cognome è obbligatorio e non può essere una stringa vuota")
        @Size(min = 2, max = 30, message = "Il cognome deve essere compreso tra i 2 e i 30 caratteri")
        String cognome,
        @NotBlank(message = "L'email è obbligatoria e non può essere una stringa vuota")
        @Email(message = "L'email inserita non è nel formato corretto")
        String email,
        @NotBlank(message = "La password è obbligatoria")
        @Size(min = 8, message = "La password deve avere almeno 4 caratteri")
        @Pattern(regexp = "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{4,}$", message = "La password deve contenere almeno una maiuscola, una minuscola,....")
        String password

) {
}
