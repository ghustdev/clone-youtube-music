package org.example.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record MusicRequest(
        @NotBlank @Size(max = 180) String title,
        @NotBlank @Size(max = 160) String artist,
        @Size(max = 180) String album,
        @Size(max = 120) String genre,
        @NotBlank
        @Size(max = 600)
        @Pattern(regexp = "^(https?://)?(www\\.)?(youtube\\.com|youtu\\.be)/.+$", message = "must be a YouTube URL")
        String youtubeUrl,
        @NotNull @Positive Integer durationSeconds
) {
}
