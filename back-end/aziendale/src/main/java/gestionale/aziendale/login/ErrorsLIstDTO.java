package gestionale.aziendale.login;

import java.time.LocalDateTime;
import java.util.List;

public record ErrorsLIstDTO(String messaggio, LocalDateTime tempo, List<String> errori) {
}
