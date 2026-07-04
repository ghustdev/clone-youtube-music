package org.example.backend.controller;

import java.util.List;

import org.example.backend.dto.GeneroRequest;
import org.example.backend.dto.GeneroResponse;
import org.example.backend.service.GeneroService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/generos")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Admin — Gêneros", description = "CRUD de gêneros musicais (admin)")
public class AdminGeneroController {

    private final GeneroService service;

    public AdminGeneroController(GeneroService service) {
        this.service = service;
    }

    @Operation(summary = "Listar gêneros")
    @GetMapping
    public List<GeneroResponse> listAll() {
        return service.listAll();
    }

    @Operation(summary = "Buscar gênero por ID")
    @GetMapping("/{id}")
    public GeneroResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @Operation(summary = "Criar gênero")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public GeneroResponse create(@Valid @RequestBody GeneroRequest request) {
        return service.create(request);
    }

    @Operation(summary = "Atualizar gênero")
    @PutMapping("/{id}")
    public GeneroResponse update(@PathVariable Long id, @Valid @RequestBody GeneroRequest request) {
        return service.update(id, request);
    }

    @Operation(summary = "Deletar gênero em cascata")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
