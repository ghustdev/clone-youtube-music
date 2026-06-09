package org.example.backend.dto;

import java.time.LocalDateTime;

public record UserResponse(
        Long id,
        String name,
        String email,
        Boolean isAdmin,
        String role,
        LocalDateTime createdAt
) {
}
