package org.example.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record AlbumRequest(
        @NotBlank @Size(max = 180) String titulo,
        @NotNull @Positive Long artistaId,
        @JsonProperty("capa_url") @Size(max = 600) String capaUrl,
        @JsonProperty("ano_lancamento") Integer anoLancamento
) {}
