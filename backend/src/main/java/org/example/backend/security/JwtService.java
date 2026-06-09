package org.example.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.example.backend.model.Usuario;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;

@Service
public class JwtService {

    private final JwtProperties properties;

    public JwtService(JwtProperties properties) {
        this.properties = properties;
    }

    public String generateToken(Usuario usuario) {
        Instant now = Instant.now();
        Instant expiration = now.plusMillis(properties.expirationMs());

        return Jwts.builder()
                .subject(usuario.getEmail())
                .claim("name", usuario.getNome())
                .claim("role", usuario.admin() ? "ROLE_ADMIN" : "ROLE_USER")
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiration))
                .signWith(signingKey())
                .compact();
    }

    public String extractUsername(String token) {
        return claims(token).getSubject();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        return username.equalsIgnoreCase(userDetails.getUsername()) && claims(token).getExpiration().after(new Date());
    }

    public long expirationMs() {
        return properties.expirationMs();
    }

    private Claims claims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey signingKey() {
        return Keys.hmacShaKeyFor(properties.secret().getBytes(StandardCharsets.UTF_8));
    }
}
