package com.neoclass.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
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
<<<<<<< HEAD
 * Filtro que intercepta todas as requisições (OncePerRequestFilter) e procura o header "Authorization: Bearer <token>".
 * Se o token for válido, extrai subject e role e cria um Authentication com a authority correspondente.
=======
 * Filtro JWT que:
 * ‣ ignora (cai fora) para rotas públicas (login, cadastro de secretaria, swagger, OPTIONS)
 * ‣ nas demais rotas, exige cabeçalho "Authorization: Bearer <token>"
 * ‣ se faltar ou inválido, devolve 401
 * ‣ se válido, popula Authentication no SecurityContext e segue adiante
>>>>>>> master
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
        String path   = req.getServletPath();
        String method = req.getMethod();

<<<<<<< HEAD
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
=======
        System.out.println("[JwtFilter] → request: " + method + " " + path);

        // 1) Rotas públicas (login, cadastro de secretarias, swagger e qualquer OPTIONS)
        if (
            pathMatcher.match("/api/login/**", path)       ||  // login
            pathMatcher.match("/api/secretarias", path)     ||  // cadastro de secretaria
            pathMatcher.match("/v3/api-docs/**", path)      ||  // Swagger
            pathMatcher.match("/swagger-ui/**", path)       ||  // Swagger UI
            "OPTIONS".equalsIgnoreCase(method)                 // preflight CORS
        ) {
            System.out.println("[JwtFilter] → Rota pública ou OPTIONS");
            chain.doFilter(req, res);
            return;
        }

        // 2) Demais rotas exigem header "Authorization: Bearer <token>"
        String header = req.getHeader("Authorization");
        System.out.println("[JwtFilter] → Authorization header: " + header);

        if (header == null || !header.startsWith("Bearer ")) {
            // Falta token ou formato errado → 401 Unauthorized
            System.out.println("[JwtFilter] → Token ausente ou mal formado. Retornando 401.");
            res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        String token = header.substring(7);
        try {
            // jwtUtil.validarToken() lança JwtException se inválido ou expirado
            String email = jwtUtil.validarToken(token);
            System.out.println("[JwtFilter] → Token válido! subject (email) = " + email);

            // Popula o SecurityContext com Authentication contendo só o email (sem roles)
            UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(
                    email,
                    null,
                    List.of() // sem roles
                );
            SecurityContextHolder.getContext().setAuthentication(auth);

        } catch (JwtException ex) {
            // Token inválido ou expirado → 401 Unauthorized
            System.out.println("[JwtFilter] → Token inválido ou expirado. Retornando 401.");
            res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        // 3) Se chegou aqui, JWT é válido → continua a cadeia de filtros
>>>>>>> master
        chain.doFilter(req, res);
    }
}
