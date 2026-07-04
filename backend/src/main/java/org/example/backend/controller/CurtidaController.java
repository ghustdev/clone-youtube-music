package org.example.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Curtidas", description = "Músicas curtidas pelo usuário autenticado")
public class CurtidaController {

    private final CurtidaService curtidaService;

    public CurtidaController(CurtidaService curtidaService) {
        this.curtidaService = curtidaService;
    }

    @Operation(summary = "Listar músicas curtidas")
    @GetMapping
    public List<MusicResponse> listMine() {
        return curtidaService.listMine();
    }

    @Operation(summary = "Curtir ou descurtir música (toggle)")
    @PostMapping("/{musicaId}/toggle")
    public List<MusicResponse> toggle(@PathVariable Long musicaId) {
        return curtidaService.toggle(musicaId);
    }

    @Operation(summary = "Verificar se música está curtida")
    @GetMapping("/{musicaId}/status")
    public Map<String, Boolean> status(@PathVariable Long musicaId) {
        return Map.of("liked", curtidaService.isCurtida(musicaId));
    }
}
