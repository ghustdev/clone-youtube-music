package org.example.backend.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.example.backend.dto.MusicResponse;
import org.example.backend.service.RecommendationService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@SecurityRequirement(name = "bearerAuth")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping
    public List<MusicResponse> recommend(@RequestParam Long musicId) {
        return recommendationService.recommend(musicId);
    }
}
