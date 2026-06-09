package org.example.backend.repository;

import org.example.backend.model.Album;
import org.example.backend.model.Artista;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AlbumRepository extends JpaRepository<Album, Long> {
    Optional<Album> findByTituloIgnoreCaseAndArtista(String titulo, Artista artista);
}
