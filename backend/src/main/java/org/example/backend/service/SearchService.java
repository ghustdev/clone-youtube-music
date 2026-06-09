package org.example.backend.service;

import org.example.backend.dto.SearchResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SearchService {

    private final MusicService musicService;
    private final PlaylistService playlistService;

    public SearchService(MusicService musicService, PlaylistService playlistService) {
        this.musicService = musicService;
        this.playlistService = playlistService;
    }

    @Transactional(readOnly = true)
    public SearchResponse search(String term, String filter) {
        String normalizedFilter = filter == null ? "all" : filter.trim().toLowerCase();
        return switch (normalizedFilter) {
            case "music", "musics", "musicas" ->
                    new SearchResponse(musicService.search(term), java.util.List.of());
            case "playlist", "playlists" ->
                    new SearchResponse(java.util.List.of(), playlistService.searchMine(term));
            case "all", "" ->
                    new SearchResponse(musicService.search(term), playlistService.searchMine(term));
            default -> throw new IllegalArgumentException("Invalid search filter");
        };
    }
}
