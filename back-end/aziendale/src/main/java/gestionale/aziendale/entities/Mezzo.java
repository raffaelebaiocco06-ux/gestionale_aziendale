package gestionale.aziendale.entities;

import gestionale.aziendale.enumm.TipoMezzo;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "mezzi")
@NoArgsConstructor
@Getter
@Setter
public class Mezzo {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String targa;
    @Column(nullable = false)
    private String marca;
    @Column(nullable = false)
    private String modello;

    @Enumerated(EnumType.STRING)
    private TipoMezzo tipo;
    @Column(nullable = false)
    private Integer anno;
    @Column(nullable = false)
    private LocalDate assicurazioneScadenza;
    @Column(nullable = false)
    private LocalDate bolloScadenza;
    @Column(nullable = false)
    private LocalDate revisioneScadenza;

    public Mezzo(String targa, String marca, String modello, TipoMezzo tipo, Integer anno, LocalDate assicurazioneScadenza, LocalDate bolloScadenza, LocalDate revisioneScadenza) {
        this.targa = targa;
        this.marca = marca;
        this.modello = modello;
        this.tipo = tipo;
        this.anno = anno;
        this.assicurazioneScadenza = assicurazioneScadenza;
        this.bolloScadenza = bolloScadenza;
        this.revisioneScadenza = revisioneScadenza;
    }
}