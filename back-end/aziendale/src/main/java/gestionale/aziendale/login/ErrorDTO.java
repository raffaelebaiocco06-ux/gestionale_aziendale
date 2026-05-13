package gestionale.aziendale.login;

import java.time.LocalDateTime;

public record ErrorDTO(String messaggio, LocalDateTime tempo) {
}
