package org.example.backend.service;

import org.example.backend.dto.DtoMapper;
import org.example.backend.dto.PlayHistoryRequest;
import org.example.backend.dto.PlayHistoryResponse;
import org.example.backend.exception.ResourceNotFoundException;
import org.example.backend.model.HistoricoReproducao;
import org.example.backend.model.Musica;
import org.example.backend.model.Usuario;
import org.example.backend.repository.HistoricoReproducaoRepository;
import org.example.backend.repository.MusicaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PlayHistoryService {

    private final HistoricoReproducaoRepository historicoReproducaoRepository;
    private final MusicaRepository musicaRepository;
    private final CurrentUserService currentUserService;

    public PlayHistoryService(
            HistoricoReproducaoRepository historicoReproducaoRepository,
            MusicaRepository musicaRepository,
            CurrentUserService currentUserService
    ) {
        this.historicoReproducaoRepository = historicoReproducaoRepository;
        this.musicaRepository = musicaRepository;
        this.currentUserService = currentUserService;
    }

    @Transactional(readOnly = true)
    public List<PlayHistoryResponse> listMine() {
        Usuario usuario = currentUserService.getCurrentUser();
        return historicoReproducaoRepository.findTop50ByUsuarioOrderByReproduzidoEmDesc(usuario)
                .stream()
                .map(DtoMapper::toPlayHistoryResponse)
                .toList();
    }

    @Transactional
    public PlayHistoryResponse record(PlayHistoryRequest request) {
        Usuario usuario = currentUserService.getCurrentUser();
        Musica musica = musicaRepository.findById(request.musicId())
                .orElseThrow(() -> new ResourceNotFoundException("Music not found"));
        HistoricoReproducao history = historicoReproducaoRepository.save(new HistoricoReproducao(usuario, musica));
        return DtoMapper.toPlayHistoryResponse(history);
    }
}
