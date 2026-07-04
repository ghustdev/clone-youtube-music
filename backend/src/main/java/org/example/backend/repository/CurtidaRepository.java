package org.example.backend.repository;

import org.example.backend.model.Curtida;
import org.example.backend.model.Musica;
import org.example.backend.model.Usuario;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CurtidaRepository extends JpaRepository<Curtida, Long> {

    @EntityGraph(attributePaths = {"musica", "musica.artista", "musica.album", "musica.genero"})
    List<Curtida> findByUsuarioOrderByCurtidoEmDesc(Usuario usuario);

    Optional<Curtida> findByUsuarioAndMusica(Usuario usuario, Musica musica);

    boolean existsByUsuarioAndMusica(Usuario usuario, Musica musica);

    void deleteByMusica(Musica musica);
}
