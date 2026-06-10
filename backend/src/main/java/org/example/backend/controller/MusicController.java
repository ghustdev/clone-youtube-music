package org.example.backend.controller;

import java.util.List;

import org.example.backend.dto.MusicResponse;
import org.example.backend.service.MusicService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/musics")
@CrossOrigin(origins = "http://localhost:3000")
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
