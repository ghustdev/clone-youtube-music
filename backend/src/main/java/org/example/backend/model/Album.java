package org.example.backend.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "albums",
        uniqueConstraints = @UniqueConstraint(name = "uk_albums_artista_titulo", columnNames = {"artista_id", "titulo"})
)
public class Album {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 180)
    private String titulo;

    @Column(name = "capa_url", length = 600)
    private String capaUrl;

    @Column(name = "ano_lancamento")
    private Integer anoLancamento;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "artista_id", nullable = false)
    private Artista artista;

    @OneToMany(mappedBy = "album", cascade = CascadeType.ALL)
    private List<Musica> faixas = new ArrayList<>();

    protected Album() {
    }

    public Album(String titulo, Artista artista) {
        this.titulo = titulo;
        this.artista = artista;
    }

    public Album(String titulo, String capaUrl, Integer anoLancamento, Artista artista) {
        this.titulo = titulo;
        this.capaUrl = capaUrl;
        this.anoLancamento = anoLancamento;
        this.artista = artista;
    }

    public List<Musica> obterFaixas() {
        return faixas;
    }

    public Long getId() {
        return id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getCapaUrl() {
        return capaUrl;
    }

    public void setCapaUrl(String capaUrl) {
        this.capaUrl = capaUrl;
    }

    public Integer getAnoLancamento() {
        return anoLancamento;
    }

    public void setAnoLancamento(Integer anoLancamento) {
        this.anoLancamento = anoLancamento;
    }

    public Artista getArtista() {
        return artista;
    }

    public void setArtista(Artista artista) {
        this.artista = artista;
    }

    public List<Musica> getFaixas() {
        return faixas;
    }
}
