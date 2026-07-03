package org.example.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record AlbumResponse(
        Long id,
        String titulo,
        @JsonProperty("artistaId") Long artistaId,
        String artista,
        @JsonProperty("capa_url") String capaUrl,
        @JsonProperty("ano_lancamento") Integer anoLancamento
) {}
