package org.example.backend.controller;

import java.util.List;

import org.example.backend.dto.PlayHistoryRequest;
import org.example.backend.dto.PlayHistoryResponse;
import org.example.backend.service.PlayHistoryService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/history")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Histórico", description = "Histórico de reprodução do usuário autenticado")
public class PlayHistoryController {

    private final PlayHistoryService playHistoryService;

    public PlayHistoryController(PlayHistoryService playHistoryService) {
        this.playHistoryService = playHistoryService;
    }

    @Operation(summary = "Listar histórico de reprodução")
    @GetMapping
    public List<PlayHistoryResponse> listMine() {
        return playHistoryService.listMine();
    }

    @Operation(summary = "Registrar reprodução")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PlayHistoryResponse record(@Valid @RequestBody PlayHistoryRequest request) {
        return playHistoryService.record(request);
    }
}
