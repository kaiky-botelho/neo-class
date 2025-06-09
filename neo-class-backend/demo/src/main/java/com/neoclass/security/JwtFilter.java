package com.neoclass.security;

import io.jsonwebtoken.JwtException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    public JwtFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest  req,
            HttpServletResponse res,
            FilterChain         chain
    ) throws ServletException, IOException {
        String path   = req.getServletPath();
        String method = req.getMethod();

        System.out.println("[JwtFilter] → request: " + method + " " + path);

        // 1) Rotas públicas que não exigem JWT: os três logins + criação de secretaria + Swagger + OPTIONS
        if (
            pathMatcher.match("/api/login/secretaria", path)  ||
            pathMatcher.match("/api/login/aluno", path)       ||
            pathMatcher.match("/api/login/professor", path)   ||
            pathMatcher.match("/api/secretarias", path)       ||
            pathMatcher.match("/v3/api-docs/**", path)        ||
            pathMatcher.match("/swagger-ui/**", path)         ||
            "OPTIONS".equalsIgnoreCase(method)
        ) {
            System.out.println("[JwtFilter] → Rota pública ou OPTIONS");
            chain.doFilter(req, res);
            return;
        }

        // 2) Nas demais, exige cabeçalho Authorization: Bearer <token>
        String header = req.getHeader("Authorization");
        System.out.println("[JwtFilter] → Authorization header: " + header);
        if (header == null || !header.startsWith("Bearer ")) {
            System.out.println("[JwtFilter] → Token ausente ou mal formado. Retornando 401.");
            res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        String token = header.substring(7);
        try {
            String email = jwtUtil.validarToken(token);
            System.out.println("[JwtFilter] → Token válido! subject (email) = " + email);
            UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(email, null, List.of());
            SecurityContextHolder.getContext().setAuthentication(auth);
        } catch (JwtException ex) {
            System.out.println("[JwtFilter] → Token inválido ou expirado. Retornando 401.");
            res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        // 3) JWT válido → segue a cadeia
        chain.doFilter(req, res);
    }
}
