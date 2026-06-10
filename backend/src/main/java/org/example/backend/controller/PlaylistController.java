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

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/playlists")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin(origins = "http://localhost:3000")
public class PlaylistController {

    private final PlaylistService playlistService;

    public PlaylistController(PlaylistService playlistService) {
        this.playlistService = playlistService;
    }

    @GetMapping
    public List<PlaylistResponse> listMine() {
        return playlistService.listMine();
    }

    @GetMapping("/{id}")
    public PlaylistResponse getMine(@PathVariable Long id) {
        return playlistService.getMine(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PlaylistResponse create(@Valid @RequestBody PlaylistRequest request) {
        return playlistService.create(request);
    }

    @PutMapping("/{id}")
    public PlaylistResponse update(@PathVariable Long id, @Valid @RequestBody PlaylistRequest request) {
        return playlistService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        playlistService.delete(id);
    }

    @PostMapping("/{id}/musics/{musicId}")
    public PlaylistResponse addMusic(@PathVariable Long id, @PathVariable Long musicId) {
        return playlistService.addMusic(id, musicId);
    }

    @DeleteMapping("/{id}/musics/{musicId}")
    public PlaylistResponse removeMusic(@PathVariable Long id, @PathVariable Long musicId) {
        return playlistService.removeMusic(id, musicId);
    }
}
