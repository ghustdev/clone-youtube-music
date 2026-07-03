package org.example.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;

public record MusicResponse(
        Long id,
        String title,
        ArtistInfo artist,
        AlbumInfo album,
        String genre,
        String youtubeUrl,
        Integer durationSeconds,
        LocalDateTime createdAt
) {
    public record ArtistInfo(
            Long id,
            String nome,
            @JsonProperty("foto_url") String fotoUrl,
            String biografia
    ) {}

    public record AlbumInfo(
            Long id,
            String titulo,
            @JsonProperty("capa_url") String capaUrl,
            @JsonProperty("ano_lancamento") Integer anoLancamento
    ) {}
}
