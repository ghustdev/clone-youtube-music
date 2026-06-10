package org.example.backend.controller;

import java.util.List;

import org.example.backend.dto.MusicRequest;
import org.example.backend.dto.MusicResponse;
import org.example.backend.service.MusicService;
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
@RequestMapping("/api/admin/musics")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminMusicController {

    private final MusicService musicService;

    public AdminMusicController(MusicService musicService) {
        this.musicService = musicService;
    }

    @GetMapping
    public List<MusicResponse> listAll() {
        return musicService.listAll();
    }

    @GetMapping("/{id}")
    public MusicResponse getById(@PathVariable Long id) {
        return musicService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MusicResponse create(@Valid @RequestBody MusicRequest request) {
        return musicService.create(request);
    }

    @PutMapping("/{id}")
    public MusicResponse update(@PathVariable Long id, @Valid @RequestBody MusicRequest request) {
        return musicService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        musicService.delete(id);
    }
}
