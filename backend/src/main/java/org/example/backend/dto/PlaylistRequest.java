package org.example.backend.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PlaylistRequest(
        @JsonProperty("nome") @JsonAlias("name") @NotBlank @Size(max = 120) String name,
        @JsonProperty("descricao") @JsonAlias("description") @Size(max = 500) String description,
        @JsonProperty("capa_url") @Size(max = 600) String capaUrl
) {
}
