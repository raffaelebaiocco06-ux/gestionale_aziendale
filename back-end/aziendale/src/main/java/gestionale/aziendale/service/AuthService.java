package gestionale.aziendale.service;

import gestionale.aziendale.entities.Utente;
import gestionale.aziendale.exception.NotFound;
import gestionale.aziendale.exception.UnauthorizedException;
import gestionale.aziendale.login.LoginDTO;
import gestionale.aziendale.security.TokenTools;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UtenteService utenteService;
    private final TokenTools tokenTools;
    private final PasswordEncoder bcrypt;

    public AuthService(UtenteService utenteService, TokenTools tokenTools, PasswordEncoder bcrypt) {
        this.utenteService = utenteService;
        this.tokenTools = tokenTools;
        this.bcrypt = bcrypt;
    }

    // qui devo fare un controllo delle credenziali


    public String checkCredentialsAndGenerateToken(LoginDTO body){
        try{
            Utente trovato= this.utenteService.findByEmail(body.email());
            if(this.bcrypt.matches(body.password(), trovato.getPassword())){
                return this.tokenTools.generateToken(trovato);
            }else{
                throw new UnauthorizedException("Credenziali errate");
            }




        }catch(NotFound ex){
            throw new UnauthorizedException("Credenziali errate");
        }
    }
}
