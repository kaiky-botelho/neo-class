package com.neoclass.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

/**
 * Filtro que intercepta todas as requisições (OncePerRequestFilter) e procura o header "Authorization: Bearer <token>".
 * Se o token for válido, extrai subject e role e cria um Authentication com a authority correspondente.
 */
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest  req,
            HttpServletResponse res,
            FilterChain         chain
    ) throws ServletException, IOException {

        String header = req.getHeader("Authorization");

        // Se houver um header Authorization começando com "Bearer "
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            try {
                // Valida o token e extrai todas as claims
                Claims claims = jwtUtil.extrairClaims(token);

                // Pega o subject (e-mail) e a role que gravamos no token
                String email = claims.getSubject();
                String roleDoToken = claims.get("role", String.class);

                // Converte a string "SECRETARIA" ou "PROFESSOR" em GrantedAuthority
                // O prefixo "ROLE_" é a convenção adotada pelo Spring Security
                SimpleGrantedAuthority authority =
                    new SimpleGrantedAuthority("ROLE_" + roleDoToken);

                // Cria um Authentication válido, com a lista de authorities
                UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(
                        email,
                        null,
                        List.of(authority)
                    );

                // Grava no contexto de segurança
                SecurityContextHolder.getContext().setAuthentication(auth);

            } catch (JwtException ex) {
                // Se o token for inválido ou expirado, devolve 401 Unauthorized
                res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
        }

        // Continua a cadeia de filtros (se o usuário não tiver header, vai seguir como não autenticado)
        chain.doFilter(req, res);
    }
}
