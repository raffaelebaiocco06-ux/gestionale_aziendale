package gestionale.aziendale.payload;

import gestionale.aziendale.enumm.TipoCategoria;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CategoriaDTO(

        @NotBlank(message = "Il nome della categoria è obbligatorio")
        String nome,

        @NotNull(message = "Il tipo della categoria è obbligatorio")
        TipoCategoria tipo

) {
}
