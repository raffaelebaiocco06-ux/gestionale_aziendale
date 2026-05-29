package gestionale.aziendale.service;

import gestionale.aziendale.entities.Utente;
import gestionale.aziendale.exception.UnauthorizedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class CurrentUserService {

    public Utente getUtenteLoggato() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || authentication.getPrincipal() == null) {
            throw new UnauthorizedException("Utente non autenticato");
        }

        Object principal = authentication.getPrincipal();

        if (!(principal instanceof Utente)) {
            throw new UnauthorizedException("Utente non valido");
        }

        return (Utente) principal;
    }
}
