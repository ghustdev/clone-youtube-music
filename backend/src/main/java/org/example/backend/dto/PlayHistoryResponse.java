package org.example.backend.dto;

import java.time.LocalDateTime;

public record PlayHistoryResponse(
        Long id,
        MusicResponse music,
        LocalDateTime playedAt
) {
}
