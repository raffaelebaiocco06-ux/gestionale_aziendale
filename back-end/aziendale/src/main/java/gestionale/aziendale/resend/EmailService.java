package gestionale.aziendale.resend;

import com.resend.Resend;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;
import gestionale.aziendale.entities.Scadenza;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final Resend resend;

    @Value("${resend.from.email}")
    private String fromEmail;

    public EmailService(Resend resend) {
        this.resend = resend;
    }

    public void sendWelcomeEmail(String to, String nome) {

        CreateEmailOptions params = CreateEmailOptions.builder()
                .from(fromEmail).to(to).subject("Benvenuto nel gestionale")
                .html("<h2>Ciao " + nome + "!</h2>" + "<p>La registrazione è stata completata correttamente.</p>").build();

        try {

            CreateEmailResponse response = resend.emails().send(params);
            System.out.println("Email inviata: " + response.getId());

        } catch (Exception e) {

            throw new RuntimeException(
                    "Errore durante l'invio email: " + e.getMessage()
            );
        }
    }
    public void sendReminderScadenzaEmail(String to, String nome, Scadenza scadenza) {
        CreateEmailOptions params = CreateEmailOptions.builder()
                .from(fromEmail)
                .to(to)
                .subject("Promemoria scadenza: " + scadenza.getTitolo())
                .html(
                        "<h2>Ciao " + nome + "</h2>" +
                                "<p>Ti ricordiamo che tra 30 giorni scadrà:</p>" +
                                "<h3>" + scadenza.getTitolo() + "</h3>" +
                                "<p><strong>Data scadenza:</strong> " + scadenza.getDataScadenza() + "</p>" +
                                "<p><strong>Descrizione:</strong> " + scadenza.getDescrizione() + "</p>"
                )
                .build();

        try {
            resend.emails().send(params);
        } catch (Exception e) {
            throw new RuntimeException("Errore durante l'invio email scadenza: " + e.getMessage());
        }
    }
}
