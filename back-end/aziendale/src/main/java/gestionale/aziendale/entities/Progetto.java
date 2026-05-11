package gestionale.aziendale.entities;

import gestionale.aziendale.enumm.StatoProgetto;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "progetti")
@NoArgsConstructor
@Getter
@Setter
public class Progetto {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String nome;
    @Column(nullable = false)
    private String descrizione;

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;
    @Column(nullable = false)
    private LocalDate dataInizio;
    @Column(nullable = false)
    private LocalDate dataFine;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatoProgetto stato;
    @Column(nullable = false)
    private BigDecimal budget;

    public Progetto(String nome, String descrizione, Cliente cliente, LocalDate dataInizio, LocalDate dataFine, StatoProgetto stato, BigDecimal budget) {
        this.nome = nome;
        this.descrizione = descrizione;
        this.cliente = cliente;
        this.dataInizio = dataInizio;
        this.dataFine = dataFine;
        this.stato = stato;
        this.budget = budget;
    }
}
