package org.example.backend.dto;

import java.util.List;

public record SearchResponse(
        List<MusicResponse> musics,
        List<PlaylistResponse> playlists
) {
}
