package org.example.backend.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.OrderBy;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "filas_reproducao")
public class FilaReproducao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "atualizada_em", nullable = false)
    private LocalDateTime atualizadaEm;

    @Column(name = "indice_atual", nullable = false)
    private Integer indiceAtual = -1;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    private Usuario usuario;

    @OneToMany(mappedBy = "filaReproducao", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("ordem ASC")
    private List<FilaMusica> filaMusicas = new ArrayList<>();

    public FilaReproducao() {
    }

    public FilaReproducao(Usuario usuario) {
        this.usuario = usuario;
    }

    @PrePersist
    @PreUpdate
    void atualizarData() {
        atualizadaEm = LocalDateTime.now();
        if (indiceAtual == null) {
            indiceAtual = -1;
        }
    }

    public void adicionarAFila(Musica musica) {
        filaMusicas.add(new FilaMusica(this, musica, filaMusicas.size()));
        atualizadaEm = LocalDateTime.now();
        if (indiceAtual < 0) {
            indiceAtual = 0;
        }
    }

    public Musica proximaMusica() {
        if (filaMusicas.isEmpty()) {
            return null;
        }
        indiceAtual = Math.min(indiceAtual + 1, filaMusicas.size() - 1);
        atualizadaEm = LocalDateTime.now();
        return filaMusicas.get(indiceAtual).getMusica();
    }

    public Musica musicaAnterior() {
        if (filaMusicas.isEmpty()) {
            return null;
        }
        indiceAtual = Math.max(indiceAtual - 1, 0);
        atualizadaEm = LocalDateTime.now();
        return filaMusicas.get(indiceAtual).getMusica();
    }

    public void gerarFilaAutomatica(List<HistoricoReproducao> historico) {
        Set<Musica> musicasUnicas = new LinkedHashSet<>();
        historico.forEach(item -> musicasUnicas.add(item.getMusica()));
        filaMusicas.clear();
        int ordem = 0;
        for (Musica musica : musicasUnicas) {
            filaMusicas.add(new FilaMusica(this, musica, ordem));
            ordem++;
        }
        indiceAtual = filaMusicas.isEmpty() ? -1 : 0;
        atualizadaEm = LocalDateTime.now();
    }

    public void limparFila() {
        filaMusicas.clear();
        indiceAtual = -1;
        atualizadaEm = LocalDateTime.now();
    }

    public void removerMusica(Musica musica) {
        filaMusicas.removeIf(item -> item.getMusica().getId().equals(musica.getId()));
        reordenar();
        if (filaMusicas.isEmpty()) {
            indiceAtual = -1;
        } else if (indiceAtual >= filaMusicas.size()) {
            indiceAtual = filaMusicas.size() - 1;
        }
        atualizadaEm = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public LocalDateTime getAtualizadaEm() {
        return atualizadaEm;
    }

    public Integer getIndiceAtual() {
        return indiceAtual;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public List<Musica> getMusicas() {
        return filaMusicas.stream()
                .map(FilaMusica::getMusica)
                .toList();
    }

    public List<FilaMusica> getFilaMusicas() {
        return filaMusicas;
    }

    private void reordenar() {
        for (int i = 0; i < filaMusicas.size(); i++) {
            filaMusicas.get(i).setOrdem(i);
        }
    }
}
