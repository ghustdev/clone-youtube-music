package org.example.backend.dto;

import org.example.backend.model.Album;
import org.example.backend.model.Artista;
import org.example.backend.model.Genero;
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
                new MusicResponse.ArtistInfo(
                        musica.getArtista().getId(),
                        musica.getArtista().getNome(),
                        musica.getArtista().getFotoUrl(),
                        musica.getArtista().getBiografia()
                ),
                new MusicResponse.AlbumInfo(
                        musica.getAlbum().getId(),
                        musica.getAlbum().getTitulo(),
                        musica.getAlbum().getCapaUrl(),
                        musica.getAlbum().getAnoLancamento()
                ),
                musica.getGenero().getNome(),
                musica.getUrlYoutube(),
                musica.getDuracaoSegundos(),
                musica.getCriadoEm()
        );
    }

    public static ArtistaResponse toArtistaResponse(Artista artista) {
        return new ArtistaResponse(artista.getId(), artista.getNome(), artista.getBiografia(), artista.getFotoUrl());
    }

    public static GeneroResponse toGeneroResponse(Genero genero) {
        return new GeneroResponse(genero.getId(), genero.getNome());
    }

    public static AlbumResponse toAlbumResponse(Album album) {
        return new AlbumResponse(
                album.getId(),
                album.getTitulo(),
                album.getArtista().getId(),
                album.getArtista().getNome(),
                album.getCapaUrl(),
                album.getAnoLancamento()
        );
    }

    public static PlaylistResponse toPlaylistResponse(Playlist playlist) {
        return new PlaylistResponse(
                playlist.getId(),
                playlist.getNome(),
                playlist.getDescricao(),
                playlist.getCapaUrl(),
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
