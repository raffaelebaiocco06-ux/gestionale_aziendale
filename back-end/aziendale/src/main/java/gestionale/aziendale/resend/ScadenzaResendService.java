package gestionale.aziendale.resend;

import gestionale.aziendale.entities.Mezzo;
import gestionale.aziendale.entities.Scadenza;
import gestionale.aziendale.entities.Utente;
import gestionale.aziendale.repository.ScadenzaRepository;
import gestionale.aziendale.repository.UtenteRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ScadenzaResendService {

    private final ScadenzaRepository scadenzaRepository;
    private final EmailService emailService;

    public ScadenzaResendService(ScadenzaRepository scadenzaRepository, EmailService emailService) {
        this.scadenzaRepository = scadenzaRepository;
        this.emailService = emailService;
    }

    @Scheduled(cron = "0 0 8 * * *")
    public void inviaPromemoriaScadenze() {

        LocalDate dataDaControllare = LocalDate.now().plusDays(30);

        List<Scadenza> scadenze = scadenzaRepository.findByDataScadenza(dataDaControllare);

        for (Scadenza scadenza : scadenze) {

            Mezzo mezzo = scadenza.getMezzo();
            if (mezzo == null || mezzo.getUtente() == null) {
                continue;
            }
            Utente utente = mezzo.getUtente();
            emailService.sendReminderScadenzaEmail(utente.getEmail(), utente.getNome(), scadenza);
        }
    }
}
