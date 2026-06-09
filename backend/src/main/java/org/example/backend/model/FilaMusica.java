package org.example.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "fila_musicas")
public class FilaMusica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "fila_reproducao_id", nullable = false)
    private FilaReproducao filaReproducao;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "musica_id", nullable = false)
    private Musica musica;

    @Column(nullable = false)
    private Integer ordem;

    protected FilaMusica() {
    }

    public FilaMusica(FilaReproducao filaReproducao, Musica musica, Integer ordem) {
        this.filaReproducao = filaReproducao;
        this.musica = musica;
        this.ordem = ordem;
    }

    public Long getId() {
        return id;
    }

    public FilaReproducao getFilaReproducao() {
        return filaReproducao;
    }

    public Musica getMusica() {
        return musica;
    }

    public Integer getOrdem() {
        return ordem;
    }

    public void setOrdem(Integer ordem) {
        this.ordem = ordem;
    }
}
