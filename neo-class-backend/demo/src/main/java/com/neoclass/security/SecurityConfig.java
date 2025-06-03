package com.neoclass.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtUtil jwtUtil;

    public SecurityConfig(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
          // 1) Habilita o suporte a CORS usando o bean corsConfigurationSource()
          .cors()
          .and()
          // 2) Desabilita CSRF para facilitar chamadas REST
          .csrf().disable()
          // 3) Define quais requisições são permitidas sem autenticação
          .authorizeHttpRequests(auth -> auth
              // libera POST em /api/secretarias e /api/login/**
              .requestMatchers(HttpMethod.POST, "/api/secretarias", "/api/login/**").permitAll()
              // libera acesso à documentação do Swagger/OpenAPI
              .requestMatchers(
                  "/v3/api-docs/**",
                  "/swagger-ui.html",
                  "/swagger-ui/**"
              ).permitAll()
              // qualquer outra rota precisa estar autenticada
              .anyRequest().authenticated()
          )
          // 4) Garante que a aplicação não irá criar sessão HTTP (stateless)
          .sessionManagement(sm ->
              sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
          )
          // 5) Adiciona o JwtFilter antes do filtro padrão de username/password
          .addFilterBefore(
              new JwtFilter(jwtUtil),
              UsernamePasswordAuthenticationFilter.class
          )
          // 6) Desabilita frameOptions (por exemplo se usar H2 console)
          .headers(headers ->
              headers.frameOptions().disable()
          );

        return http.build();
    }

    /**
     * Configuração global de CORS.
     * Permite que origens específicas (localhost:3000 e localhost:8081) façam
     * requisições para este backend.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // 1) Adicione aqui todas as origens que irão chamar sua API (por exemplo, React Web em 3000, Expo Web em 8081, etc.)
        config.setAllowedOriginPatterns(List.of(
            "http://localhost:3000",
            "http://localhost:8081"
        ));

        // 2) Métodos HTTP permitidos
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // 3) Quais headers o cliente pode enviar
        config.setAllowedHeaders(List.of("*"));

        // 4) Permitir envio de credenciais/cookies (caso necessário)
        config.setAllowCredentials(true);

        // 5) Aplica essa configuração a **todos** os endpoints (/**)
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
