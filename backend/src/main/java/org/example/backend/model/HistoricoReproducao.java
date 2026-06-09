package org.example.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "historicos_reproducao")
public class HistoricoReproducao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reproduzido_em", nullable = false)
    private LocalDateTime reproduzidoEm;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "musica_id", nullable = false)
    private Musica musica;

    protected HistoricoReproducao() {
    }

    public HistoricoReproducao(Usuario usuario, Musica musica) {
        registrar(usuario, musica);
    }

    @PrePersist
    void prePersist() {
        if (reproduzidoEm == null) {
            reproduzidoEm = LocalDateTime.now();
        }
    }

    public void registrar(Usuario usuario, Musica musica) {
        this.usuario = usuario;
        this.musica = musica;
        this.reproduzidoEm = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public LocalDateTime getReproduzidoEm() {
        return reproduzidoEm;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public Musica getMusica() {
        return musica;
    }
}
