// src/main/java/com/neoclass/security/JwtFilter.java
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

/**
 * Filtro que valida JWT em todas as rotas, exceto:
 *   - /api/login/**
 *   - /api/secretarias
 *   - endpoints de documentação Swagger/OpenAPI
 *
 * Se o token for válido, define o 'principal' no Authentication como o emailInstitucional.
 */
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

        // 1) Pule a validação para rotas públicas:
        if (pathMatcher.match("/api/login/**", path)
         || pathMatcher.match("/api/secretarias", path)
         || pathMatcher.match("/v3/api-docs/**", path)
         || pathMatcher.match("/swagger-ui/**", path)) {
            chain.doFilter(req, res);
            return;
        }

        // 2) Para todas as outras rotas, extrai o header "Authorization: Bearer <token>"
        String header = req.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            try {
                String token = header.substring(7);
                // jwtUtil.validarToken lança JwtException se inválido/extrado
                String email = jwtUtil.validarToken(token);

                // Cria authentication com principal = emailInstitucional
                var auth = new UsernamePasswordAuthenticationToken(
                    email, 
                    null, 
                    List.of()  // sem autoridades específicas
                );
                SecurityContextHolder.getContext().setAuthentication(auth);
            } catch (JwtException ex) {
                // Token inválido ou expirado → 401 Unauthorized
                res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
        } else {
            // Sem header Authorization → 403 Forbidden
            res.setStatus(HttpServletResponse.SC_FORBIDDEN);
            return;
        }

        // 3) Prossegue no fluxo de filtros
        chain.doFilter(req, res);
    }
}
