package org.example.backend.service;

import org.example.backend.dto.DtoMapper;
import org.example.backend.dto.MusicRequest;
import org.example.backend.dto.MusicResponse;
import org.example.backend.exception.ResourceNotFoundException;
import org.example.backend.model.Album;
import org.example.backend.model.Artista;
import org.example.backend.model.FilaReproducao;
import org.example.backend.model.Genero;
import org.example.backend.model.Musica;
import org.example.backend.model.Playlist;
import org.example.backend.repository.AlbumRepository;
import org.example.backend.repository.ArtistaRepository;
import org.example.backend.repository.FilaReproducaoRepository;
import org.example.backend.repository.GeneroRepository;
import org.example.backend.repository.HistoricoReproducaoRepository;
import org.example.backend.repository.MusicaRepository;
import org.example.backend.repository.PlaylistRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
public class MusicService {

    private static final String DEFAULT_ALBUM = "Single";
    private static final String DEFAULT_GENRE = "Indefinido";

    private final MusicaRepository musicaRepository;
    private final PlaylistRepository playlistRepository;
    private final HistoricoReproducaoRepository historicoReproducaoRepository;
    private final FilaReproducaoRepository filaReproducaoRepository;
    private final ArtistaRepository artistaRepository;
    private final AlbumRepository albumRepository;
    private final GeneroRepository generoRepository;

    public MusicService(
            MusicaRepository musicaRepository,
            PlaylistRepository playlistRepository,
            HistoricoReproducaoRepository historicoReproducaoRepository,
            FilaReproducaoRepository filaReproducaoRepository,
            ArtistaRepository artistaRepository,
            AlbumRepository albumRepository,
            GeneroRepository generoRepository
    ) {
        this.musicaRepository = musicaRepository;
        this.playlistRepository = playlistRepository;
        this.historicoReproducaoRepository = historicoReproducaoRepository;
        this.filaReproducaoRepository = filaReproducaoRepository;
        this.artistaRepository = artistaRepository;
        this.albumRepository = albumRepository;
        this.generoRepository = generoRepository;
    }

    @Transactional(readOnly = true)
    public List<MusicResponse> listAll() {
        return musicaRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(Musica::getTitulo, String.CASE_INSENSITIVE_ORDER))
                .map(DtoMapper::toMusicResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public MusicResponse getById(Long id) {
        return DtoMapper.toMusicResponse(getEntity(id));
    }

    @Transactional(readOnly = true)
    public List<MusicResponse> search(String term) {
        String normalized = normalizeSearchTerm(term);
        if (normalized.isBlank()) {
            return listAll();
        }
        return musicaRepository.search(normalized)
                .stream()
                .map(DtoMapper::toMusicResponse)
                .toList();
    }

    @Transactional
    public MusicResponse create(MusicRequest request) {
        Artista artista = getOrCreateArtista(request.artist());
        Album album = getOrCreateAlbum(request.album(), artista);
        Genero genero = getOrCreateGenero(request.genre());

        Musica musica = new Musica(
                request.title().trim(),
                request.youtubeUrl().trim(),
                request.durationSeconds(),
                album,
                artista,
                genero
        );
        return DtoMapper.toMusicResponse(musicaRepository.save(musica));
    }

    @Transactional
    public MusicResponse update(Long id, MusicRequest request) {
        Musica musica = getEntity(id);
        Artista artista = getOrCreateArtista(request.artist());
        Album album = getOrCreateAlbum(request.album(), artista);
        Genero genero = getOrCreateGenero(request.genre());

        musica.setTitulo(request.title().trim());
        musica.setArtista(artista);
        musica.setAlbum(album);
        musica.setGenero(genero);
        musica.setUrlYoutube(request.youtubeUrl().trim());
        musica.setDuracaoSegundos(request.durationSeconds());
        return DtoMapper.toMusicResponse(musicaRepository.save(musica));
    }

    @Transactional
    public void delete(Long id) {
        Musica musica = getEntity(id);
        List<Playlist> playlists = playlistRepository.findAllByMusicas_Id(id);
        playlists.forEach(playlist -> playlist.removerMusica(musica));
        playlistRepository.saveAll(playlists);

        List<FilaReproducao> filas = filaReproducaoRepository.findAllByFilaMusicas_Musica_Id(id);
        filas.forEach(fila -> fila.removerMusica(musica));
        filaReproducaoRepository.saveAll(filas);

        historicoReproducaoRepository.deleteByMusica(musica);
        musicaRepository.delete(musica);
    }

    @Transactional(readOnly = true)
    public Musica getEntity(Long id) {
        return musicaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Music not found"));
    }

    private String normalizeSearchTerm(String term) {
        return term == null ? "" : term.trim();
    }

    private Artista getOrCreateArtista(String nome) {
        String normalized = normalizeRequired(nome, "Artist is required");
        return artistaRepository.findByNomeIgnoreCase(normalized)
                .orElseGet(() -> artistaRepository.save(new Artista(normalized)));
    }

    private Album getOrCreateAlbum(String titulo, Artista artista) {
        String normalized = normalizeOptional(titulo, DEFAULT_ALBUM);
        return albumRepository.findByTituloIgnoreCaseAndArtista(normalized, artista)
                .orElseGet(() -> albumRepository.save(new Album(normalized, artista)));
    }

    private Genero getOrCreateGenero(String nome) {
        String normalized = normalizeOptional(nome, DEFAULT_GENRE);
        return generoRepository.findByNomeIgnoreCase(normalized)
                .orElseGet(() -> generoRepository.save(new Genero(normalized)));
    }

    private String normalizeRequired(String value, String message) {
        if (value == null || value.trim().isBlank()) {
            throw new IllegalArgumentException(message);
        }
        return value.trim();
    }

    private String normalizeOptional(String value, String defaultValue) {
        if (value == null || value.trim().isBlank()) {
            return defaultValue;
        }
        return value.trim();
    }
}
