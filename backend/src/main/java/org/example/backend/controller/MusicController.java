package org.example.backend.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.example.backend.dto.MusicResponse;
import org.example.backend.service.MusicService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/musics")
@SecurityRequirement(name = "bearerAuth")
public class MusicController {

    private final MusicService musicService;

    public MusicController(MusicService musicService) {
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

    @GetMapping("/search")
    public List<MusicResponse> search(@RequestParam(name = "q", defaultValue = "") String term) {
        return musicService.search(term);
    }
}
