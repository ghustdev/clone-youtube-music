package org.example.backend.repository;

import org.example.backend.model.Genero;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GeneroRepository extends JpaRepository<Genero, Long> {
    Optional<Genero> findByNomeIgnoreCase(String nome);
}
