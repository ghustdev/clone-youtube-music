package org.example.backend.service;

import org.example.backend.dto.DtoMapper;
import org.example.backend.dto.MusicResponse;
import org.example.backend.model.Musica;
import org.example.backend.repository.MusicaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class RecommendationService {

    private final MusicService musicService;
    private final MusicaRepository musicaRepository;

    public RecommendationService(MusicService musicService, MusicaRepository musicaRepository) {
        this.musicService = musicService;
        this.musicaRepository = musicaRepository;
    }

    @Transactional(readOnly = true)
    public List<MusicResponse> recommend(Long musicId) {
        Musica current = musicService.getEntity(musicId);
        Map<Long, Musica> recommendations = new LinkedHashMap<>();

        musicaRepository.findTop10ByArtista_NomeIgnoreCaseAndIdNotOrderByTituloAsc(current.getArtista().getNome(), current.getId())
                .forEach(music -> recommendations.putIfAbsent(music.getId(), music));

        if (current.getGenero() != null && recommendations.size() < 10) {
            musicaRepository.findTop10ByGenero_NomeIgnoreCaseAndIdNotOrderByTituloAsc(current.getGenero().getNome(), current.getId())
                    .forEach(music -> recommendations.putIfAbsent(music.getId(), music));
        }

        if (recommendations.size() < 10) {
            musicaRepository.findTop10ByIdNotOrderByTituloAsc(current.getId())
                    .forEach(music -> recommendations.putIfAbsent(music.getId(), music));
        }

        return recommendations.values()
                .stream()
                .limit(10)
                .map(DtoMapper::toMusicResponse)
                .toList();
    }
}
