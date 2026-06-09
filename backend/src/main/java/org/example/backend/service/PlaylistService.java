package org.example.backend.service;

import org.example.backend.dto.DtoMapper;
import org.example.backend.dto.PlaylistRequest;
import org.example.backend.dto.PlaylistResponse;
import org.example.backend.exception.ConflictException;
import org.example.backend.exception.ResourceNotFoundException;
import org.example.backend.model.Musica;
import org.example.backend.model.Playlist;
import org.example.backend.model.Usuario;
import org.example.backend.repository.MusicaRepository;
import org.example.backend.repository.PlaylistRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PlaylistService {

    private final PlaylistRepository playlistRepository;
    private final MusicaRepository musicaRepository;
    private final CurrentUserService currentUserService;

    public PlaylistService(
            PlaylistRepository playlistRepository,
            MusicaRepository musicaRepository,
            CurrentUserService currentUserService
    ) {
        this.playlistRepository = playlistRepository;
        this.musicaRepository = musicaRepository;
        this.currentUserService = currentUserService;
    }

    @Transactional(readOnly = true)
    public List<PlaylistResponse> listMine() {
        Usuario usuario = currentUserService.getCurrentUser();
        return playlistRepository.findByUsuarioOrderByCriadoEmDesc(usuario)
                .stream()
                .map(DtoMapper::toPlaylistResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public PlaylistResponse getMine(Long id) {
        return DtoMapper.toPlaylistResponse(findMine(id));
    }

    @Transactional(readOnly = true)
    public List<PlaylistResponse> searchMine(String term) {
        Usuario usuario = currentUserService.getCurrentUser();
        String normalized = term == null ? "" : term.trim();
        if (normalized.isBlank()) {
            return listMine();
        }
        return playlistRepository.searchByUsuario(usuario, normalized)
                .stream()
                .map(DtoMapper::toPlaylistResponse)
                .toList();
    }

    @Transactional
    public PlaylistResponse create(PlaylistRequest request) {
        Usuario usuario = currentUserService.getCurrentUser();
        String name = request.name().trim();
        ensureNameAvailable(usuario, name);
        Playlist playlist = playlistRepository.save(new Playlist(name, trimToNull(request.description()), usuario));
        return DtoMapper.toPlaylistResponse(playlist);
    }

    @Transactional
    public PlaylistResponse update(Long id, PlaylistRequest request) {
        Usuario usuario = currentUserService.getCurrentUser();
        Playlist playlist = findMine(id, usuario);
        String name = request.name().trim();
        if (!playlist.getNome().equalsIgnoreCase(name)) {
            ensureNameAvailable(usuario, name);
        }
        playlist.renomear(name);
        playlist.setDescricao(trimToNull(request.description()));
        return DtoMapper.toPlaylistResponse(playlistRepository.save(playlist));
    }

    @Transactional
    public void delete(Long id) {
        playlistRepository.delete(findMine(id));
    }

    @Transactional
    public PlaylistResponse addMusic(Long playlistId, Long musicId) {
        Playlist playlist = findMine(playlistId);
        Musica musica = musicaRepository.findById(musicId)
                .orElseThrow(() -> new ResourceNotFoundException("Music not found"));
        playlist.adicionarMusica(musica);
        return DtoMapper.toPlaylistResponse(playlistRepository.save(playlist));
    }

    @Transactional
    public PlaylistResponse removeMusic(Long playlistId, Long musicId) {
        Playlist playlist = findMine(playlistId);
        Musica musica = musicaRepository.findById(musicId)
                .orElseThrow(() -> new ResourceNotFoundException("Music not found"));
        playlist.removerMusica(musica);
        return DtoMapper.toPlaylistResponse(playlistRepository.save(playlist));
    }

    private Playlist findMine(Long id) {
        return findMine(id, currentUserService.getCurrentUser());
    }

    private Playlist findMine(Long id, Usuario usuario) {
        return playlistRepository.findByIdAndUsuario(id, usuario)
                .orElseThrow(() -> new ResourceNotFoundException("Playlist not found"));
    }

    private void ensureNameAvailable(Usuario usuario, String name) {
        if (playlistRepository.existsByUsuarioAndNomeIgnoreCase(usuario, name)) {
            throw new ConflictException("Playlist name already exists");
        }
    }

    private String trimToNull(String value) {
        if (value == null || value.trim().isBlank()) {
            return null;
        }
        return value.trim();
    }
}
