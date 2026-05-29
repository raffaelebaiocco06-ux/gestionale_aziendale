package gestionale.aziendale.controller;

import gestionale.aziendale.entities.Utente;
import gestionale.aziendale.exception.ValidationException;
import gestionale.aziendale.login.LoginDTO;
import gestionale.aziendale.login.LoginRespDTO;
import gestionale.aziendale.login.UtenteDTO;
import gestionale.aziendale.login.UtenteRespDTO;
import gestionale.aziendale.service.AuthService;
import gestionale.aziendale.service.UtenteService;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final UtenteService utenteService;

    public AuthController(AuthService authService, UtenteService utenteService) {

        this.authService = authService;
        this.utenteService=utenteService;
    }

    @PostMapping("/login")
    public LoginRespDTO login(@RequestBody LoginDTO body) {
        return new LoginRespDTO(this.authService.checkCredentialsAndGenerateToken(body));
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED) // 201
    public UtenteRespDTO saveUser(@RequestBody @Validated UtenteDTO body, BindingResult validationResult) {

        if (validationResult.hasErrors()) {
            List<String> errors = validationResult.getFieldErrors().stream().map(error -> error.getDefaultMessage()).toList();
            throw new ValidationException(errors);
        }

        Utente nuovo = this.utenteService.save(body);
        return new UtenteRespDTO(nuovo.getId());
    }

}
