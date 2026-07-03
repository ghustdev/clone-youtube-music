package org.example.backend.repository;

import org.example.backend.model.FilaReproducao;
import org.example.backend.model.Usuario;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface FilaReproducaoRepository extends JpaRepository<FilaReproducao, Long> {

    @EntityGraph(attributePaths = {
            "filaMusicas",
            "filaMusicas.musica",
            "filaMusicas.musica.artista",
            "filaMusicas.musica.album",
            "filaMusicas.musica.genero"
    })
    Optional<FilaReproducao> findByUsuario(Usuario usuario);

    @EntityGraph(attributePaths = {"filaMusicas", "filaMusicas.musica"})
    List<FilaReproducao> findAllByFilaMusicas_Musica_Id(Long musicaId);

    @EntityGraph(attributePaths = {"filaMusicas", "filaMusicas.musica"})
    List<FilaReproducao> findAllByFilaMusicas_Musica_Album_Id(Long albumId);

    @EntityGraph(attributePaths = {"filaMusicas", "filaMusicas.musica"})
    List<FilaReproducao> findAllByFilaMusicas_Musica_Artista_Id(Long artistaId);

    @EntityGraph(attributePaths = {"filaMusicas", "filaMusicas.musica"})
    List<FilaReproducao> findAllByFilaMusicas_Musica_Genero_Id(Long generoId);
}
