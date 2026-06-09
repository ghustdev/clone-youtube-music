package org.example.backend.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "usuarios",
        uniqueConstraints = @UniqueConstraint(name = "uk_usuarios_email", columnNames = "email")
)
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String nome;

    @Column(nullable = false, length = 160)
    private String email;

    @Column(nullable = false)
    private String senha;

    @Column(name = "is_admin", nullable = false)
    private Boolean isAdmin = false;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Playlist> playlists = new ArrayList<>();

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<HistoricoReproducao> historicos = new ArrayList<>();

    @OneToOne(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private FilaReproducao filaReproducao;

    protected Usuario() {
    }

    public Usuario(String nome, String email, String senha, Boolean isAdmin) {
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.isAdmin = isAdmin;
    }

    @PrePersist
    void prePersist() {
        if (criadoEm == null) {
            criadoEm = LocalDateTime.now();
        }
        if (isAdmin == null) {
            isAdmin = false;
        }
    }

    public Boolean autenticar(String senha) {
        return this.senha != null && this.senha.equals(senha);
    }

    public Playlist criarPlaylist(String nome) {
        Playlist playlist = new Playlist(nome, this);
        playlists.add(playlist);
        return playlist;
    }

    public boolean admin() {
        return Boolean.TRUE.equals(isAdmin);
    }

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public Boolean getIsAdmin() {
        return isAdmin;
    }

    public void setIsAdmin(Boolean isAdmin) {
        this.isAdmin = isAdmin;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public List<Playlist> getPlaylists() {
        return playlists;
    }

    public List<HistoricoReproducao> getHistoricos() {
        return historicos;
    }

    public FilaReproducao getFilaReproducao() {
        return filaReproducao;
    }

    public void setFilaReproducao(FilaReproducao filaReproducao) {
        this.filaReproducao = filaReproducao;
    }
}
