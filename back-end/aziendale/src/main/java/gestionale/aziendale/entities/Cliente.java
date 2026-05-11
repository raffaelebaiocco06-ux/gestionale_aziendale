package gestionale.aziendale.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "clienti")
@NoArgsConstructor
@Getter
@Setter
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String nome;
    @Column(nullable = false, unique = true)
    private String partitaIva;
    @Column(nullable = false, unique = true)
    private String codiceFiscale;
    @Column(nullable = false)
    private String telefono;
    @Column(nullable = false, unique = true)
    private String email;
    @Column(nullable = false)
    private String indirizzo;
    @Column(nullable = false)
    private String citta;

    public Cliente(String nome, String partitaIva, String codiceFiscale, String telefono, String email, String indirizzo, String citta) {
        this.nome = nome;
        this.partitaIva = partitaIva;
        this.codiceFiscale = codiceFiscale;
        this.telefono = telefono;
        this.email = email;
        this.indirizzo = indirizzo;
        this.citta = citta;
    }
}
