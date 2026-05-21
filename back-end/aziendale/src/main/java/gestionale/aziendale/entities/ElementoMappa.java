package gestionale.aziendale.entities;

import gestionale.aziendale.enumm.StatoElementoMappa;
import gestionale.aziendale.enumm.TipoElementoMappa;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "elementi_mappa")
@Getter
@Setter
@NoArgsConstructor
public class ElementoMappa {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "mappa_fiera_id", nullable = false)
    private MappaFiera mappaFiera;

    private String nome;

    @Enumerated(EnumType.STRING)
    private TipoElementoMappa tipo;

    private Double x;
    private Double y;
    private Double larghezza;
    private Double altezza;

    private String colore;

    @Enumerated(EnumType.STRING)
    private StatoElementoMappa stato;

    public ElementoMappa(MappaFiera mappaFiera, String nome, TipoElementoMappa tipo, Double x, Double y, Double larghezza, Double altezza, String colore, StatoElementoMappa stato) {
        this.mappaFiera = mappaFiera;
        this.nome = nome;
        this.tipo = tipo;
        this.x = x;
        this.y = y;
        this.larghezza = larghezza;
        this.altezza = altezza;
        this.colore = colore;
        this.stato = stato;
    }
}
