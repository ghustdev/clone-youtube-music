package org.example.backend.service;

import org.example.backend.dto.DtoMapper;
import org.example.backend.dto.MusicResponse;
import org.example.backend.exception.ResourceNotFoundException;
import org.example.backend.model.Curtida;
import org.example.backend.model.Musica;
import org.example.backend.model.Usuario;
import org.example.backend.repository.CurtidaRepository;
import org.example.backend.repository.MusicaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CurtidaService {

    private final CurtidaRepository curtidaRepository;
    private final MusicaRepository musicaRepository;
    private final CurrentUserService currentUserService;

    public CurtidaService(
            CurtidaRepository curtidaRepository,
            MusicaRepository musicaRepository,
            CurrentUserService currentUserService
    ) {
        this.curtidaRepository = curtidaRepository;
        this.musicaRepository = musicaRepository;
        this.currentUserService = currentUserService;
    }

    @Transactional(readOnly = true)
    public List<MusicResponse> listMine() {
        Usuario usuario = currentUserService.getCurrentUser();
        return curtidaRepository.findByUsuarioOrderByCurtidoEmDesc(usuario)
                .stream()
                .map(c -> DtoMapper.toMusicResponse(c.getMusica()))
                .toList();
    }

    @Transactional
    public List<MusicResponse> toggle(Long musicaId) {
        Usuario usuario = currentUserService.getCurrentUser();
        Musica musica = musicaRepository.findById(musicaId)
                .orElseThrow(() -> new ResourceNotFoundException("Música não encontrada: " + musicaId));

        curtidaRepository.findByUsuarioAndMusica(usuario, musica)
                .ifPresentOrElse(
                        curtidaRepository::delete,
                        () -> curtidaRepository.save(new Curtida(usuario, musica))
                );

        return listMine();
    }

    @Transactional(readOnly = true)
    public boolean isCurtida(Long musicaId) {
        Usuario usuario = currentUserService.getCurrentUser();
        Musica musica = musicaRepository.findById(musicaId)
                .orElseThrow(() -> new ResourceNotFoundException("Música não encontrada: " + musicaId));
        return curtidaRepository.existsByUsuarioAndMusica(usuario, musica);
    }
}
