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
import jakarta.persistence.UniqueConstraint;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "curtidas",
        uniqueConstraints = @UniqueConstraint(name = "uk_curtidas_usuario_musica", columnNames = {"usuario_id", "musica_id"})
)
public class Curtida {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "musica_id", nullable = false)
    private Musica musica;

    @Column(name = "curtido_em", nullable = false, updatable = false)
    private LocalDateTime curtidoEm;

    protected Curtida() {
    }

    public Curtida(Usuario usuario, Musica musica) {
        this.usuario = usuario;
        this.musica = musica;
    }

    @PrePersist
    void prePersist() {
        if (curtidoEm == null) curtidoEm = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public Usuario getUsuario() { return usuario; }
    public Musica getMusica() { return musica; }
    public LocalDateTime getCurtidoEm() { return curtidoEm; }
}
