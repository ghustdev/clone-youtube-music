package org.example.backend.service;

import java.util.List;

import org.example.backend.dto.AlbumRequest;
import org.example.backend.dto.AlbumResponse;
import org.example.backend.dto.DtoMapper;
import org.example.backend.exception.ConflictException;
import org.example.backend.exception.ResourceNotFoundException;
import org.example.backend.model.Album;
import org.example.backend.model.Artista;
import org.example.backend.model.FilaReproducao;
import org.example.backend.model.Musica;
import org.example.backend.model.Playlist;
import org.example.backend.repository.AlbumRepository;
import org.example.backend.repository.ArtistaRepository;
import org.example.backend.repository.CurtidaRepository;
import org.example.backend.repository.FilaReproducaoRepository;
import org.example.backend.repository.HistoricoReproducaoRepository;
import org.example.backend.repository.MusicaRepository;
import org.example.backend.repository.PlaylistRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AlbumService {

    private final AlbumRepository albumRepository;
    private final ArtistaRepository artistaRepository;
    private final MusicaRepository musicaRepository;
    private final PlaylistRepository playlistRepository;
    private final HistoricoReproducaoRepository historicoRepository;
    private final FilaReproducaoRepository filaRepository;
    private final CurtidaRepository curtidaRepository;

    public AlbumService(
            AlbumRepository albumRepository,
            ArtistaRepository artistaRepository,
            MusicaRepository musicaRepository,
            PlaylistRepository playlistRepository,
            HistoricoReproducaoRepository historicoRepository,
            FilaReproducaoRepository filaRepository,
            CurtidaRepository curtidaRepository
    ) {
        this.albumRepository = albumRepository;
        this.artistaRepository = artistaRepository;
        this.musicaRepository = musicaRepository;
        this.playlistRepository = playlistRepository;
        this.historicoRepository = historicoRepository;
        this.filaRepository = filaRepository;
        this.curtidaRepository = curtidaRepository;
    }

    @Transactional(readOnly = true)
    public List<AlbumResponse> listAll() {
        return albumRepository.findAll().stream().map(DtoMapper::toAlbumResponse).toList();
    }

    @Transactional(readOnly = true)
    public AlbumResponse getById(Long id) {
        return DtoMapper.toAlbumResponse(findOrThrow(id));
    }

    @Transactional
    public AlbumResponse create(AlbumRequest request) {
        Artista artista = findArtistaOrThrow(request.artistaId());
        if (albumRepository.findByTituloIgnoreCaseAndArtista(request.titulo(), artista).isPresent()) {
            throw new ConflictException("Álbum já cadastrado para este artista.");
        }
        Album album = new Album(request.titulo(), request.capaUrl(), request.anoLancamento(), artista);
        return DtoMapper.toAlbumResponse(albumRepository.save(album));
    }

    @Transactional
    public AlbumResponse update(Long id, AlbumRequest request) {
        Album album = findOrThrow(id);
        Artista artista = findArtistaOrThrow(request.artistaId());
        albumRepository.findByTituloIgnoreCaseAndArtista(request.titulo(), artista)
                .filter(a -> !a.getId().equals(id))
                .ifPresent(a -> { throw new ConflictException("Álbum já cadastrado para este artista."); });
        album.setTitulo(request.titulo());
        album.setArtista(artista);
        album.setCapaUrl(request.capaUrl());
        album.setAnoLancamento(request.anoLancamento());
        return DtoMapper.toAlbumResponse(albumRepository.save(album));
    }

    @Transactional
    public void delete(Long id) {
        Album album = findOrThrow(id);
        deleteMusicasDependencies(musicaRepository.findAllByAlbum_Id(id));
        albumRepository.delete(album);
    }

    void deleteMusicasDependencies(List<Musica> musicas) {
        for (Musica musica : musicas) {
            List<Playlist> playlists = playlistRepository.findAllByMusicas_Id(musica.getId());
            playlists.forEach(p -> p.removerMusica(musica));
            playlistRepository.saveAll(playlists);

            List<FilaReproducao> filas = filaRepository.findAllByFilaMusicas_Musica_Id(musica.getId());
            filas.forEach(f -> f.removerMusica(musica));
            filaRepository.saveAll(filas);

            historicoRepository.deleteByMusica(musica);
            curtidaRepository.deleteByMusica(musica);
        }
        musicaRepository.deleteAll(musicas);
    }

    private Album findOrThrow(Long id) {
        return albumRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Álbum não encontrado: " + id));
    }

    private Artista findArtistaOrThrow(Long artistaId) {
        return artistaRepository.findById(artistaId)
                .orElseThrow(() -> new ResourceNotFoundException("Artista não encontrado: " + artistaId));
    }
}
