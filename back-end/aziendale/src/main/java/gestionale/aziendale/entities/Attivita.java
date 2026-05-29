package gestionale.aziendale.entities;

import gestionale.aziendale.enumm.StatoAttivita;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "attivita")
@NoArgsConstructor
@Getter
@Setter
public class Attivita {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "progetto_id")
    private Progetto progetto;

    @Column(nullable = false)
    private String titolo;
    @Column(nullable = false)
    private String descrizione;
    @Column(nullable = false)
    private LocalDate scadenza;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatoAttivita stato;

    public Attivita(Progetto progetto, String titolo, String descrizione, LocalDate scadenza, StatoAttivita stato) {
        this.progetto = progetto;
        this.titolo = titolo;
        this.descrizione = descrizione;
        this.scadenza = scadenza;
        this.stato = stato;
    }
}
