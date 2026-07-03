package org.example.backend.service;

import java.util.List;

import org.example.backend.dto.DtoMapper;
import org.example.backend.dto.GeneroRequest;
import org.example.backend.dto.GeneroResponse;
import org.example.backend.exception.ConflictException;
import org.example.backend.exception.ResourceNotFoundException;
import org.example.backend.model.Genero;
import org.example.backend.repository.GeneroRepository;
import org.example.backend.repository.MusicaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GeneroService {

    private final GeneroRepository repository;
    private final MusicaRepository musicaRepository;
    private final AlbumService albumService;

    public GeneroService(
            GeneroRepository repository,
            MusicaRepository musicaRepository,
            AlbumService albumService
    ) {
        this.repository = repository;
        this.musicaRepository = musicaRepository;
        this.albumService = albumService;
    }

    @Transactional(readOnly = true)
    public List<GeneroResponse> listAll() {
        return repository.findAll().stream().map(DtoMapper::toGeneroResponse).toList();
    }

    @Transactional(readOnly = true)
    public GeneroResponse getById(Long id) {
        return DtoMapper.toGeneroResponse(findOrThrow(id));
    }

    @Transactional
    public GeneroResponse create(GeneroRequest request) {
        if (repository.findByNomeIgnoreCase(request.nome()).isPresent()) {
            throw new ConflictException("Gênero já cadastrado: " + request.nome());
        }
        return DtoMapper.toGeneroResponse(repository.save(new Genero(request.nome())));
    }

    @Transactional
    public GeneroResponse update(Long id, GeneroRequest request) {
        Genero genero = findOrThrow(id);
        repository.findByNomeIgnoreCase(request.nome())
                .filter(g -> !g.getId().equals(id))
                .ifPresent(g -> { throw new ConflictException("Nome já utilizado por outro gênero."); });
        genero.setNome(request.nome());
        return DtoMapper.toGeneroResponse(repository.save(genero));
    }

    @Transactional
    public void delete(Long id) {
        Genero genero = findOrThrow(id);
        albumService.deleteMusicasDependencies(musicaRepository.findAllByGenero_Id(id));
        repository.delete(genero);
    }

    private Genero findOrThrow(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gênero não encontrado: " + id));
    }
}
