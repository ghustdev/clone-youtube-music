package org.example.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ArtistaRequest(
        @NotBlank @Size(max = 160) String nome,
        @Size(max = 2000) String biografia,
        @JsonProperty("foto_url") @Size(max = 600) String fotoUrl
) {}
