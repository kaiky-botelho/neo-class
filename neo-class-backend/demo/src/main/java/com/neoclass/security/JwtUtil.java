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

/**
 * Classe utilitária para gerar e validar JWT.
 * O campo 'sub' do token será o emailInstitucional do usuário.
 */
@Component
public class JwtUtil {

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
     */
    public String gerarToken(String subject) {
        Date now = new Date();
        Date expiration = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                   .setSubject(subject)      // guarda o emailInstitucional como subject
                   .setIssuedAt(now)
                   .setExpiration(expiration)
                   .signWith(key, SignatureAlgorithm.HS256)
                   .compact();
    }

    /**
     * Valida o token e retorna o 'subject' (emailInstitucional) se válido,
     * ou lança JwtException se inválido/expirado.
     */
    public String validarToken(String token) {
        Jws<Claims> claimsJws = Jwts.parserBuilder()
                                   .setSigningKey(key)
                                   .build()
                                   .parseClaimsJws(token);
        return claimsJws.getBody().getSubject();
    }
}
