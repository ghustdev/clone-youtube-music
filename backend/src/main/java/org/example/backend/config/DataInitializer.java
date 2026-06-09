package org.example.backend.config;

import org.example.backend.model.Album;
import org.example.backend.model.Artista;
import org.example.backend.model.Genero;
import org.example.backend.model.Musica;
import org.example.backend.model.Usuario;
import org.example.backend.repository.AlbumRepository;
import org.example.backend.repository.ArtistaRepository;
import org.example.backend.repository.GeneroRepository;
import org.example.backend.repository.MusicaRepository;
import org.example.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

@Configuration
public class DataInitializer {

    @Bean
    @Transactional
    ApplicationRunner seedData(
            UsuarioRepository usuarioRepository,
            MusicaRepository musicaRepository,
            ArtistaRepository artistaRepository,
            AlbumRepository albumRepository,
            GeneroRepository generoRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.seed.enabled}") boolean seedEnabled,
            @Value("${app.admin.name}") String adminName,
            @Value("${app.admin.email}") String adminEmail,
            @Value("${app.admin.password}") String adminPassword
    ) {
        return args -> {
            if (!seedEnabled) {
                return;
            }

            String normalizedAdminEmail = adminEmail.trim().toLowerCase();
            if (!usuarioRepository.existsByEmailIgnoreCase(normalizedAdminEmail)) {
                usuarioRepository.save(new Usuario(
                        adminName.trim(),
                        normalizedAdminEmail,
                        passwordEncoder.encode(adminPassword),
                        true
                ));
            }

            if (musicaRepository.count() == 0) {
                seedMusic(
                        "Bohemian Rhapsody",
                        "Queen",
                        "A Night at the Opera",
                        "Rock",
                        "https://www.youtube.com/watch?v=fJ9rUzIMcZQ",
                        354,
                        artistaRepository,
                        albumRepository,
                        generoRepository,
                        musicaRepository
                );
                seedMusic(
                        "Billie Jean",
                        "Michael Jackson",
                        "Thriller",
                        "Pop",
                        "https://www.youtube.com/watch?v=Zi_XLOBDo_Y",
                        294,
                        artistaRepository,
                        albumRepository,
                        generoRepository,
                        musicaRepository
                );
                seedMusic(
                        "Smells Like Teen Spirit",
                        "Nirvana",
                        "Nevermind",
                        "Rock",
                        "https://www.youtube.com/watch?v=hTWKbfoikeg",
                        301,
                        artistaRepository,
                        albumRepository,
                        generoRepository,
                        musicaRepository
                );
            }
        };
    }

    private void seedMusic(
            String titulo,
            String artistaNome,
            String albumTitulo,
            String generoNome,
            String urlYoutube,
            Integer duracaoSegundos,
            ArtistaRepository artistaRepository,
            AlbumRepository albumRepository,
            GeneroRepository generoRepository,
            MusicaRepository musicaRepository
    ) {
        Artista artista = artistaRepository.findByNomeIgnoreCase(artistaNome)
                .orElseGet(() -> artistaRepository.save(new Artista(artistaNome)));
        Album album = albumRepository.findByTituloIgnoreCaseAndArtista(albumTitulo, artista)
                .orElseGet(() -> albumRepository.save(new Album(albumTitulo, artista)));
        Genero genero = generoRepository.findByNomeIgnoreCase(generoNome)
                .orElseGet(() -> generoRepository.save(new Genero(generoNome)));
        musicaRepository.save(new Musica(titulo, urlYoutube, duracaoSegundos, album, artista, genero));
    }
}
