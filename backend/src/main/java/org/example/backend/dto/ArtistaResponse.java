package org.example.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ArtistaResponse(
        Long id,
        String nome,
        String biografia,
        @JsonProperty("foto_url") String fotoUrl
) {}
