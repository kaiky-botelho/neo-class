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

    public String gerarToken(String subject, List<String> roles) {
        Date now = new Date();
        Date expiration = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                   .setSubject(subject)       
                   .claim(ROLES_CLAIM, roles) 
                   .setIssuedAt(now)
                   .setExpiration(expiration)
                   .signWith(key, SignatureAlgorithm.HS256)
                   .compact();
    }

    public JwtClaims validarToken(String token) {
        Jws<Claims> claimsJws = Jwts.parserBuilder()
                                   .setSigningKey(key)
                                   .build()
                                   .parseClaimsJws(token);

        Claims body = claimsJws.getBody();
        String subject = body.getSubject();
        List<String> roles = (List<String>) body.get(ROLES_CLAIM);

        return new JwtClaims(subject, roles);
    }

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