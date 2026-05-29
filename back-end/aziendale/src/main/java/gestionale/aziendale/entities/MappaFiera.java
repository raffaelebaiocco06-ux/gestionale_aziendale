package gestionale.aziendale.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "mappe_fiera")
@Getter
@Setter
@NoArgsConstructor
public class MappaFiera {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String fileUrl;

    private Integer larghezzaOriginale;
    private Integer altezzaOriginale;

    @OneToMany(mappedBy = "mappaFiera", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ElementoMappa> elementi = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "utente_id")
    private Utente utente;

    public MappaFiera(String nome, String fileUrl, Integer larghezzaOriginale, Integer altezzaOriginale, List<ElementoMappa> elementi) {
        this.nome = nome;
        this.fileUrl = fileUrl;
        this.larghezzaOriginale = larghezzaOriginale;
        this.altezzaOriginale = altezzaOriginale;
        this.elementi = elementi;
    }
}
