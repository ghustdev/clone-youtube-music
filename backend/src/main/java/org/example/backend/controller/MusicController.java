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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/musics")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Músicas", description = "Listagem e busca pública de músicas")
public class MusicController {
    
    private final MusicService musicService;
    
    public MusicController(MusicService musicService) {
        this.musicService = musicService;
    }
    
    @Operation(summary = "Listar todas as músicas")
    @GetMapping
    public List<MusicResponse> listAll() {
        return musicService.listAll();
    }
    
    @Operation(summary = "Buscar música por ID")
    @GetMapping("/{id}")
    public MusicResponse getById(@PathVariable Long id) {
        return musicService.getById(id);
    }
    
    @Operation(summary = "Adicionar música")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MusicResponse addMusica(@RequestBody MusicRequest request) {
        return musicService.create(request);
    }
    
    @Operation(summary = "Atualizar música")
    @PutMapping("/{id}")
    public MusicResponse update(@PathVariable Long id, @RequestBody MusicRequest request) {
        return musicService.update(id, request);
    }

    @Operation(summary = "Deletar música")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        musicService.delete(id);
    }

    @Operation(summary = "Novos lançamentos (ordenado por data)")
    @GetMapping("/new-releases")
    public List<MusicResponse> newReleases() {
        return musicService.listNewReleases();
    }

    @Operation(summary = "Buscar músicas por termo")
    @GetMapping("/search")
    public List<MusicResponse> search(@RequestParam(name = "q", defaultValue = "") String term) {
        return musicService.search(term);
    }
}