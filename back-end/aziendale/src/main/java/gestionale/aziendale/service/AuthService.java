package gestionale.aziendale.service;

import gestionale.aziendale.entities.Utente;
import gestionale.aziendale.exception.NotFound;
import gestionale.aziendale.exception.UnauthorizedException;
import gestionale.aziendale.login.LoginDTO;
import gestionale.aziendale.security.TokenTools;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UtenteService utenteService;
    private final TokenTools tokenTools;

    public AuthService(UtenteService utenteService, TokenTools tokenTools) {
        this.utenteService = utenteService;
        this.tokenTools = tokenTools;
    }

    // qui devo fare un controllo delle credenziali


    public String checkCredentialsAndGenerateToken(LoginDTO body){
        try{
            Utente trovato= this.utenteService.findByEmail(body.email());
            if(trovato.getPassword().equals(body.password())){
                return this.tokenTools.generateToken(trovato);
            }else{
                throw new UnauthorizedException("Credenziali errate");
            }




        }catch(NotFound ex){
            throw new UnauthorizedException("Credenziali errate");
        }
    }
}
