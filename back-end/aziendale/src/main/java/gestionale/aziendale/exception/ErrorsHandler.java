package gestionale.aziendale.exception;



import gestionale.aziendale.login.ErrorDTO;
import gestionale.aziendale.login.ErrorsLIstDTO;
import org.springframework.http.HttpStatus;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class ErrorsHandler {

    @ExceptionHandler(BadRequEx.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST) // 400
    public ErrorDTO handleBadRequest(BadRequEx ex) {
        return new ErrorDTO(ex.getMessage(), LocalDateTime.now());
    }

    @ExceptionHandler(ValidationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST) // 400
    public ErrorsLIstDTO handleValidationErrors(ValidationException ex) {
        return new ErrorsLIstDTO(ex.getMessage(), LocalDateTime.now(), ex.getErrors());
    }

    @ExceptionHandler(UnauthorizedException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED) // 401
    public ErrorDTO handleUnauthorizedEx(UnauthorizedException ex) {
        return new ErrorDTO(ex.getMessage(), LocalDateTime.now());
    }
    @ExceptionHandler(AuthorizationDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN) // 403
    public ErrorDTO handleAuthorizationDeniedEx(AuthorizationDeniedException ex) {
        return new ErrorDTO("Non hai i permessi per accedere", LocalDateTime.now());
    }

    @ExceptionHandler(NotFound.class)
    @ResponseStatus(HttpStatus.NOT_FOUND) // 404
    public ErrorDTO handleNotFoundEx(NotFound ex) {
        return new ErrorDTO(ex.getMessage(), LocalDateTime.now());
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR) // 500
    public ErrorDTO handleGenericEx(Exception ex) {
        ex.printStackTrace();
        return new ErrorDTO("C'è stato un errore lato server, giuro che lo risolveremo presto!", LocalDateTime.now());
    }
}
