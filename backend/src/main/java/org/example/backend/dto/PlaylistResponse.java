package org.example.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public record PlaylistResponse(
        Long id,
        String name,
        String description,
        Long userId,
        List<MusicResponse> musics,
        LocalDateTime createdAt
) {
}
