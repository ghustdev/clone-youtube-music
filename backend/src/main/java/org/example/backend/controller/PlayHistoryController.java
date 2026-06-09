package org.example.backend.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.example.backend.dto.PlayHistoryRequest;
import org.example.backend.dto.PlayHistoryResponse;
import org.example.backend.service.PlayHistoryService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/history")
@SecurityRequirement(name = "bearerAuth")
public class PlayHistoryController {

    private final PlayHistoryService playHistoryService;

    public PlayHistoryController(PlayHistoryService playHistoryService) {
        this.playHistoryService = playHistoryService;
    }

    @GetMapping
    public List<PlayHistoryResponse> listMine() {
        return playHistoryService.listMine();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PlayHistoryResponse record(@Valid @RequestBody PlayHistoryRequest request) {
        return playHistoryService.record(request);
    }
}
