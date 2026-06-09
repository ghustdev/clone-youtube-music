package org.example.backend.service;

import org.example.backend.dto.AuthResponse;
import org.example.backend.dto.DtoMapper;
import org.example.backend.dto.LoginRequest;
import org.example.backend.dto.RegisterRequest;
import org.example.backend.exception.ConflictException;
import org.example.backend.model.Usuario;
import org.example.backend.repository.UsuarioRepository;
import org.example.backend.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService
    ) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = normalizeEmail(request.email());
        if (usuarioRepository.existsByEmailIgnoreCase(email)) {
            throw new ConflictException("Email already registered");
        }

        Usuario usuario = new Usuario(
                request.name().trim(),
                email,
                passwordEncoder.encode(request.password()),
                false
        );
        Usuario saved = usuarioRepository.save(usuario);
        return authResponse(saved);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String email = normalizeEmail(request.email());
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, request.password()));
        Usuario usuario = usuarioRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
        return authResponse(usuario);
    }

    private AuthResponse authResponse(Usuario usuario) {
        return new AuthResponse(
                jwtService.generateToken(usuario),
                "Bearer",
                jwtService.expirationMs(),
                DtoMapper.toUserResponse(usuario)
        );
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }
}
