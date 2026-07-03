package org.example.backend.repository;

import org.example.backend.model.Musica;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MusicaRepository extends JpaRepository<Musica, Long> {

    @Override
    @EntityGraph(attributePaths = {"artista", "album", "genero"})
    List<Musica> findAll();

    @Override
    @EntityGraph(attributePaths = {"artista", "album", "genero"})
    Optional<Musica> findById(Long id);

    @EntityGraph(attributePaths = {"artista", "album", "genero"})
    @Query("""
            select m from Musica m
            where lower(m.titulo) like lower(concat('%', :term, '%'))
               or lower(m.artista.nome) like lower(concat('%', :term, '%'))
               or lower(m.album.titulo) like lower(concat('%', :term, '%'))
               or lower(m.genero.nome) like lower(concat('%', :term, '%'))
            order by m.titulo asc
            """)
    List<Musica> search(@Param("term") String term);

    @EntityGraph(attributePaths = {"artista", "album", "genero"})
    List<Musica> findTop10ByArtista_NomeIgnoreCaseAndIdNotOrderByTituloAsc(String nomeArtista, Long id);

    @EntityGraph(attributePaths = {"artista", "album", "genero"})
    List<Musica> findTop10ByGenero_NomeIgnoreCaseAndIdNotOrderByTituloAsc(String nomeGenero, Long id);

    @EntityGraph(attributePaths = {"artista", "album", "genero"})
    List<Musica> findTop10ByIdNotOrderByTituloAsc(Long id);

    @EntityGraph(attributePaths = {"artista", "album", "genero"})
    List<Musica> findAllByOrderByCriadoEmDesc();

    List<Musica> findAllByAlbum_Id(Long albumId);

    List<Musica> findAllByArtista_Id(Long artistaId);

    List<Musica> findAllByGenero_Id(Long generoId);
}
