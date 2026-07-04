package org.example.backend.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.example.backend.dto.MusicResponse;
import org.example.backend.service.CurtidaService;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/library/likes")
@SecurityRequirement(name = "bearerAuth")
public class CurtidaController {

    private final CurtidaService curtidaService;

    public CurtidaController(CurtidaService curtidaService) {
        this.curtidaService = curtidaService;
    }

    @GetMapping
    public List<MusicResponse> listMine() {
        return curtidaService.listMine();
    }

    @PostMapping("/{musicaId}/toggle")
    public List<MusicResponse> toggle(@PathVariable Long musicaId) {
        return curtidaService.toggle(musicaId);
    }

    @GetMapping("/{musicaId}/status")
    public Map<String, Boolean> status(@PathVariable Long musicaId) {
        return Map.of("liked", curtidaService.isCurtida(musicaId));
    }
}
