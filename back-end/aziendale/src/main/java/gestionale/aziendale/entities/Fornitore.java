package gestionale.aziendale.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "fornitori")
@NoArgsConstructor
@Getter
@Setter
public class Fornitore {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String nome;
    @Column(nullable = false,unique = true)
    private String partitaIva;
    @Column(nullable = false)
    private String telefono;
    @Column(nullable = false,unique = true)
    private String email;
    @Column(nullable = false)
    private String indirizzo;
    @Column(nullable = false)
    private String categoria;

    @ManyToOne
    @JoinColumn(name = "utente_id")
    private Utente utente;

    public Fornitore(String nome, String partitaIva, String telefono, String email, String indirizzo, String categoria) {
        this.nome = nome;
        this.partitaIva = partitaIva;
        this.telefono = telefono;
        this.email = email;
        this.indirizzo = indirizzo;
        this.categoria = categoria;
    }
}
