// src/main/java/com/neoclass/security/JwtUtil.java
package com.neoclass.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Classe utilitária para gerar e validar JWT.
 * O campo 'sub' do token será o emailInstitucional do usuário.
 * O campo 'roles' do token será uma lista de String com os papéis do usuário.
 */
@Component
public class JwtUtil {

    private static final String ROLES_CLAIM = "roles"; // Chave para o claim de roles
    private final Key key;
    private final long expirationMs;

    public JwtUtil(
        @Value("${jwt.secret}") String secret,
        @Value("${jwt.expiration-ms}") long expirationMs
    ) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
    }

    /**
     * Gera um JWT assinado com HS256 contendo o 'subject' = emailInstitucional
     * e um 'claim' personalizado 'roles' com a lista de papéis do usuário.
     */
    public String gerarToken(String subject, List<String> roles) {
        Date now = new Date();
        Date expiration = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                   .setSubject(subject)       // guarda o emailInstitucional como subject
                   .claim(ROLES_CLAIM, roles) // Adiciona as roles como um claim personalizado
                   .setIssuedAt(now)
                   .setExpiration(expiration)
                   .signWith(key, SignatureAlgorithm.HS256)
                   .compact();
    }

    /**
     * Valida o token e retorna um objeto JwtClaims contendo o 'subject' (emailInstitucional)
     * e a lista de roles, ou lança JwtException se inválido/expirado.
     */
    public JwtClaims validarToken(String token) {
        Jws<Claims> claimsJws = Jwts.parserBuilder()
                                   .setSigningKey(key)
                                   .build()
                                   .parseClaimsJws(token);

        Claims body = claimsJws.getBody();
        String subject = body.getSubject();
        List<String> roles = (List<String>) body.get(ROLES_CLAIM); // Obtém as roles do claim

        return new JwtClaims(subject, roles);
    }

    /**
     * Classe interna para encapsular o subject e as roles extraídas do JWT.
     */
    public static class JwtClaims {
        private final String subject;
        private final List<String> roles;

        public JwtClaims(String subject, List<String> roles) {
            this.subject = subject;
            this.roles = roles;
        }

        public String getSubject() {
            return subject;
        }

        public List<String> getRoles() {
            return roles;
        }
    }
}