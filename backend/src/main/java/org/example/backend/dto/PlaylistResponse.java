package org.example.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;
import java.util.List;

public record PlaylistResponse(
        Long id,
        String nome,
        String descricao,
        @JsonProperty("capa_url") String capaUrl,
        @JsonProperty("usuario_id") Long usuarioId,
        List<MusicResponse> musicas,
        @JsonProperty("criado_em") LocalDateTime criadoEm
) {
}
