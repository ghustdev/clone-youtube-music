package org.example.backend.dto;

import java.time.LocalDateTime;

public record MusicResponse(
        Long id,
        String title,
        String artist,
        String album,
        String genre,
        String youtubeUrl,
        Integer durationSeconds,
        LocalDateTime createdAt
) {
}
