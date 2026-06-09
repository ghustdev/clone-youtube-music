package org.example.backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record PlayHistoryRequest(
        @NotNull @Positive Long musicId
) {
}
