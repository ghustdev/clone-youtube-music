package org.example.backend.dto;

import org.example.backend.model.HistoricoReproducao;
import org.example.backend.model.Musica;
import org.example.backend.model.Playlist;
import org.example.backend.model.Usuario;

public final class DtoMapper {

    private DtoMapper() {
    }

    public static UserResponse toUserResponse(Usuario usuario) {
        return new UserResponse(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getIsAdmin(),
                usuario.admin() ? "ADMIN" : "USER",
                usuario.getCriadoEm()
        );
    }

    public static MusicResponse toMusicResponse(Musica musica) {
        return new MusicResponse(
                musica.getId(),
                musica.getTitulo(),
                musica.getArtista().getNome(),
                musica.getAlbum().getTitulo(),
                musica.getGenero().getNome(),
                musica.getUrlYoutube(),
                musica.getDuracaoSegundos(),
                musica.getCriadoEm()
        );
    }

    public static PlaylistResponse toPlaylistResponse(Playlist playlist) {
        return new PlaylistResponse(
                playlist.getId(),
                playlist.getNome(),
                playlist.getDescricao(),
                playlist.getUsuario().getId(),
                playlist.getMusicas().stream().map(DtoMapper::toMusicResponse).toList(),
                playlist.getCriadoEm()
        );
    }

    public static PlayHistoryResponse toPlayHistoryResponse(HistoricoReproducao history) {
        return new PlayHistoryResponse(
                history.getId(),
                toMusicResponse(history.getMusica()),
                history.getReproduzidoEm()
        );
    }
}
