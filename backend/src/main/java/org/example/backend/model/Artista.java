package org.example.backend.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "artistas",
        uniqueConstraints = @UniqueConstraint(name = "uk_artistas_nome", columnNames = "nome")
)
public class Artista {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 160)
    private String nome;

    @Column(length = 2000)
    private String biografia;

    @Column(name = "foto_url", length = 600)
    private String fotoUrl;

    @OneToMany(mappedBy = "artista", cascade = CascadeType.ALL)
    private List<Album> albums = new ArrayList<>();

    public Artista() {
    }

    public Artista(String nome) {
        this.nome = nome;
    }

    public Artista(String nome, String biografia, String fotoUrl) {
        this.nome = nome;
        this.biografia = biografia;
        this.fotoUrl = fotoUrl;
    }

    public List<Album> obterDiscografia() {
        return albums;
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

    public String getBiografia() {
        return biografia;
    }

    public void setBiografia(String biografia) {
        this.biografia = biografia;
    }

    public String getFotoUrl() {
        return fotoUrl;
    }

    public void setFotoUrl(String fotoUrl) {
        this.fotoUrl = fotoUrl;
    }

    public List<Album> getAlbums() {
        return albums;
    }
	
	public void setId(long l) {
	
	}
}
