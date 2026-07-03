package org.example.backend.controller;

import java.util.List;

import org.example.backend.dto.ArtistaRequest;
import org.example.backend.dto.ArtistaResponse;
import org.example.backend.service.ArtistaService;
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

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/artistas")
@SecurityRequirement(name = "bearerAuth")
public class AdminArtistaController {

    private final ArtistaService service;

    public AdminArtistaController(ArtistaService service) {
        this.service = service;
    }

    @GetMapping
    public List<ArtistaResponse> listAll() {
        return service.listAll();
    }

    @GetMapping("/{id}")
    public ArtistaResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ArtistaResponse create(@Valid @RequestBody ArtistaRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public ArtistaResponse update(@PathVariable Long id, @Valid @RequestBody ArtistaRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
