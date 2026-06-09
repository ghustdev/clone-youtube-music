package org.example.backend.repository;

import org.example.backend.model.HistoricoReproducao;
import org.example.backend.model.Musica;
import org.example.backend.model.Usuario;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HistoricoReproducaoRepository extends JpaRepository<HistoricoReproducao, Long> {

    @EntityGraph(attributePaths = {"musica", "musica.artista", "musica.album", "musica.genero"})
    List<HistoricoReproducao> findTop50ByUsuarioOrderByReproduzidoEmDesc(Usuario usuario);

    void deleteByMusica(Musica musica);
}
