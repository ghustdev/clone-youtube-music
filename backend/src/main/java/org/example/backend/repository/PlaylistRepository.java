package org.example.backend.repository;

import org.example.backend.model.Playlist;
import org.example.backend.model.Usuario;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PlaylistRepository extends JpaRepository<Playlist, Long> {

    @EntityGraph(attributePaths = "musicas")
    List<Playlist> findByUsuarioOrderByCriadoEmDesc(Usuario usuario);

    @EntityGraph(attributePaths = "musicas")
    Optional<Playlist> findByIdAndUsuario(Long id, Usuario usuario);

    boolean existsByUsuarioAndNomeIgnoreCase(Usuario usuario, String nome);

    @EntityGraph(attributePaths = "musicas")
    List<Playlist> findAllByMusicas_Id(Long musicaId);

    List<Playlist> findAllByMusicas_Album_Id(Long albumId);

    List<Playlist> findAllByMusicas_Artista_Id(Long artistaId);

    List<Playlist> findAllByMusicas_Genero_Id(Long generoId);

    @Query("""
            select distinct p from Playlist p
            left join fetch p.musicas
            where p.usuario = :usuario
              and lower(p.nome) like lower(concat('%', :term, '%'))
            order by p.criadoEm desc
            """)
    List<Playlist> searchByUsuario(@Param("usuario") Usuario usuario, @Param("term") String term);
}
