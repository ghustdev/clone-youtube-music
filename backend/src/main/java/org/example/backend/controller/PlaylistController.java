package org.example.backend.controller;

import java.util.List;

import org.example.backend.dto.PlaylistRequest;
import org.example.backend.dto.PlaylistResponse;
import org.example.backend.service.PlaylistService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/playlists")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Playlists", description = "Gerenciamento de playlists do usuário autenticado")
public class PlaylistController {

    private final PlaylistService playlistService;

    public PlaylistController(PlaylistService playlistService) {
        this.playlistService = playlistService;
    }

    @Operation(summary = "Listar minhas playlists")
    @GetMapping
    public List<PlaylistResponse> listMine() {
        return playlistService.listMine();
    }

    @Operation(summary = "Buscar playlist por ID")
    @GetMapping("/{id}")
    public PlaylistResponse getMine(@PathVariable Long id) {
        return playlistService.getMine(id);
    }

    @Operation(summary = "Criar playlist")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PlaylistResponse create(@Valid @RequestBody PlaylistRequest request) {
        return playlistService.create(request);
    }

    @Operation(summary = "Atualizar playlist")
    @PutMapping("/{id}")
    public PlaylistResponse update(@PathVariable Long id, @Valid @RequestBody PlaylistRequest request) {
        return playlistService.update(id, request);
    }

    @Operation(summary = "Deletar playlist")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        playlistService.delete(id);
    }

    @Operation(summary = "Adicionar música à playlist")
    @PostMapping("/{id}/musics/{musicId}")
    public PlaylistResponse addMusic(@PathVariable Long id, @PathVariable Long musicId) {
        return playlistService.addMusic(id, musicId);
    }

    @Operation(summary = "Remover música da playlist")
    @DeleteMapping("/{id}/musics/{musicId}")
    public PlaylistResponse removeMusic(@PathVariable Long id, @PathVariable Long musicId) {
        return playlistService.removeMusic(id, musicId);
    }
}
