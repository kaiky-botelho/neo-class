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
        String path = req.getServletPath();

        // 1) Se for rota de login (/api/login/**), pule a validação de token
        if (pathMatcher.match("/api/login/**", path) 
            || pathMatcher.match("/api/secretarias", path)) {
            chain.doFilter(req, res);
            return;
        }

        // 2) Validação normal para rotas que exigem JWT
        String header = req.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            try {
                String token = header.substring(7);
                // jwtUtil.validarToken lança JwtException se o token for inválido
                String email = jwtUtil.validarToken(token);

                // Cria autenticação e define no contexto de segurança
                var auth = new UsernamePasswordAuthenticationToken(
                    email,
                    null,
                    List.of() // sem papéis explícitos
                );
                SecurityContextHolder.getContext().setAuthentication(auth);
            } catch (JwtException ex) {
                // Token inválido → retorna 401 Unauthorized e não segue adiante
                res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
        } else {
            // Se não houver header “Authorization: Bearer ...”, retorne 403 Forbidden
            res.setStatus(HttpServletResponse.SC_FORBIDDEN);
            return;
        }

        // 3) Prossegue no fluxo de filtros
        chain.doFilter(req, res);
    }
}
