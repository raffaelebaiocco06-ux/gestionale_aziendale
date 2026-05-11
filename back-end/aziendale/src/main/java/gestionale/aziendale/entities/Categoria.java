package gestionale.aziendale.entities;

import gestionale.aziendale.enumm.TipoCategoria;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "categorie")
@NoArgsConstructor
@Getter
@Setter
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(nullable = false)
    private String nome;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoCategoria tipo;

    public Categoria(String nome, TipoCategoria tipo) {
        this.nome = nome;
        this.tipo = tipo;
    }
}