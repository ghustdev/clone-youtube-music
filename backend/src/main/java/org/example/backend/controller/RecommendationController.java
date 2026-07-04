package org.example.backend.controller;

import java.util.List;

import org.example.backend.dto.MusicResponse;
import org.example.backend.service.RecommendationService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Recomendações", description = "Sugestões de músicas baseadas em artista e gênero")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @Operation(summary = "Recomendar músicas similares")
    @GetMapping
    public List<MusicResponse> recommend(@RequestParam Long musicId) {
        return recommendationService.recommend(musicId);
    }
}
