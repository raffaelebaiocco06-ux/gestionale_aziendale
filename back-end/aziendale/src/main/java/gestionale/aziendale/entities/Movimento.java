package gestionale.aziendale.entities;

import gestionale.aziendale.enumm.*;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "movimenti")
@NoArgsConstructor
@Getter
@Setter
public class Movimento {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;
    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;
    @ManyToOne
    @JoinColumn(name = "fornitore_id")
    private Fornitore fornitore;
    @ManyToOne
    @JoinColumn(name = "mezzo_id")
    private Mezzo mezzo;

    @Enumerated(EnumType.STRING)
    private TipoMovimento tipo;
    @Column(nullable = false)
    private String descrizione;
    @Column(nullable = false)
    private BigDecimal importo;
    @Column(nullable = false)
    private LocalDate dataMovimento;
    @Enumerated(EnumType.STRING)
    private MetodoPagamento metodoPagamento;
    @Enumerated(EnumType.STRING)
    private StatoPagamento stato;

    @ManyToOne
    @JoinColumn(name = "utente_id")
    private Utente utente;

    public Movimento(Categoria categoria, Cliente cliente, Fornitore fornitore, Mezzo mezzo, TipoMovimento tipo, String descrizione, BigDecimal importo, LocalDate dataMovimento, MetodoPagamento metodoPagamento, StatoPagamento stato) {
        this.categoria = categoria;
        this.cliente = cliente;
        this.fornitore = fornitore;
        this.mezzo = mezzo;
        this.tipo = tipo;
        this.descrizione = descrizione;
        this.importo = importo;
        this.dataMovimento = dataMovimento;
        this.metodoPagamento = metodoPagamento;
        this.stato = stato;
    }
}
