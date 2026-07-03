package org.example.backend.service;

import java.util.List;

import org.example.backend.dto.ArtistaRequest;
import org.example.backend.dto.ArtistaResponse;
import org.example.backend.dto.DtoMapper;
import org.example.backend.exception.ConflictException;
import org.example.backend.exception.ResourceNotFoundException;
import org.example.backend.model.Artista;
import org.example.backend.repository.AlbumRepository;
import org.example.backend.repository.ArtistaRepository;
import org.example.backend.repository.MusicaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ArtistaService {

    private final ArtistaRepository repository;
    private final AlbumRepository albumRepository;
    private final MusicaRepository musicaRepository;
    private final AlbumService albumService;

    public ArtistaService(
            ArtistaRepository repository,
            AlbumRepository albumRepository,
            MusicaRepository musicaRepository,
            AlbumService albumService
    ) {
        this.repository = repository;
        this.albumRepository = albumRepository;
        this.musicaRepository = musicaRepository;
        this.albumService = albumService;
    }

    @Transactional(readOnly = true)
    public List<ArtistaResponse> listAll() {
        return repository.findAll().stream().map(DtoMapper::toArtistaResponse).toList();
    }

    @Transactional(readOnly = true)
    public ArtistaResponse getById(Long id) {
        return DtoMapper.toArtistaResponse(findOrThrow(id));
    }

    @Transactional
    public ArtistaResponse create(ArtistaRequest request) {
        if (repository.findByNomeIgnoreCase(request.nome()).isPresent()) {
            throw new ConflictException("Artista já cadastrado: " + request.nome());
        }
        Artista artista = new Artista(request.nome(), request.biografia(), request.fotoUrl());
        return DtoMapper.toArtistaResponse(repository.save(artista));
    }

    @Transactional
    public ArtistaResponse update(Long id, ArtistaRequest request) {
        Artista artista = findOrThrow(id);
        repository.findByNomeIgnoreCase(request.nome())
                .filter(a -> !a.getId().equals(id))
                .ifPresent(a -> { throw new ConflictException("Nome já utilizado por outro artista."); });
        artista.setNome(request.nome());
        artista.setBiografia(request.biografia());
        artista.setFotoUrl(request.fotoUrl());
        return DtoMapper.toArtistaResponse(repository.save(artista));
    }

    @Transactional
    public void delete(Long id) {
        Artista artista = findOrThrow(id);
        albumService.deleteMusicasDependencies(musicaRepository.findAllByArtista_Id(id));
        albumRepository.deleteAll(albumRepository.findAllByArtista(artista));
        repository.delete(artista);
    }

    private Artista findOrThrow(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Artista não encontrado: " + id));
    }
}
