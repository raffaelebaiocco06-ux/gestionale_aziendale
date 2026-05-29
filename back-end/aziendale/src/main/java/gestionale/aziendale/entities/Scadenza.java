package gestionale.aziendale.entities;

import gestionale.aziendale.enumm.StatoScadenza;
import gestionale.aziendale.enumm.TipoScadenza;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "scadenze")
@NoArgsConstructor
@Getter
@Setter
public class Scadenza {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String titolo;

    @Column(nullable = false)
    private String descrizione;

    @Column(nullable = false)
    private LocalDate dataScadenza;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoScadenza tipo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatoScadenza stato;

    @ManyToOne
    @JoinColumn(name = "mezzo_id")
    private Mezzo mezzo;

    @ManyToOne
    @JoinColumn(name = "utente_id")
    private Utente utente;

    public Scadenza(String titolo, String descrizione, LocalDate dataScadenza, TipoScadenza tipo, StatoScadenza stato, Mezzo mezzo) {
        this.titolo = titolo;
        this.descrizione = descrizione;
        this.dataScadenza = dataScadenza;
        this.tipo = tipo;
        this.stato = stato;
        this.mezzo = mezzo;
    }
}
