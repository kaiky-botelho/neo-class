// src/main/java/com/neoclass/security/SecurityConfig.java
package com.neoclass.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtUtil jwtUtil;

    public SecurityConfig(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
          .csrf().disable()
          .authorizeHttpRequests(auth -> auth
              // libera criação de secretaria e todas as rotas de login
              .requestMatchers(HttpMethod.POST, "/api/secretarias", "/api/login/**").permitAll()
              // libera endpoints do OpenAPI/Swagger
              .requestMatchers(
                  "/v3/api-docs/**",
                  "/swagger-ui.html",
                  "/swagger-ui/**"
              ).permitAll()
              // tudo o mais exige JWT
              .anyRequest().authenticated()
          )
          .sessionManagement(sm ->
              sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
          )
          .addFilterBefore(
              new JwtFilter(jwtUtil),
              UsernamePasswordAuthenticationFilter.class
          )
          // libera o frame do H2 console
          .headers(headers -> headers.frameOptions().disable());

        return http.build();
    }
}
