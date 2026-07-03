package org.example.backend.controller;

import java.util.List;

import org.example.backend.dto.AlbumRequest;
import org.example.backend.dto.AlbumResponse;
import org.example.backend.service.AlbumService;
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
@RequestMapping("/api/admin/albums")
@SecurityRequirement(name = "bearerAuth")
public class AdminAlbumController {

    private final AlbumService service;

    public AdminAlbumController(AlbumService service) {
        this.service = service;
    }

    @GetMapping
    public List<AlbumResponse> listAll() {
        return service.listAll();
    }

    @GetMapping("/{id}")
    public AlbumResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AlbumResponse create(@Valid @RequestBody AlbumRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public AlbumResponse update(@PathVariable Long id, @Valid @RequestBody AlbumRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
