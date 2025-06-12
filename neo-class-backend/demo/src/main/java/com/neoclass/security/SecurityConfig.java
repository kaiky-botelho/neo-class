package com.neoclass.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
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
          .cors().and()
          .csrf().disable()
          .authorizeHttpRequests(auth -> auth

              // ─── PÚBLICOS ───────────────────────────────────
              .requestMatchers(HttpMethod.POST, "/api/secretarias").permitAll()
              .requestMatchers(HttpMethod.POST, "/api/login/**").permitAll()
              .requestMatchers("/v3/api-docs/**", "/swagger-ui.html", "/swagger-ui/**").permitAll()
              .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

              // ─── RESTRITOS POR PAPEL ─────────────────────────
              .requestMatchers(HttpMethod.GET,  "/api/secretarias/admin").hasRole("SECRETARIA")
              .requestMatchers(HttpMethod.GET,  "/api/alunos/meus-cursos").hasRole("ALUNO")
              .requestMatchers(HttpMethod.GET,  "/api/professores/minhas-turmas").hasRole("PROFESSOR")
              .requestMatchers(HttpMethod.PUT,  "/api/login/aluno/senha").hasRole("ALUNO")

              // ─── ENDPOINTS DE FREQUÊNCIA ────────────────────
              .requestMatchers(HttpMethod.POST,   "/api/frequencias").hasRole("SECRETARIA")
              .requestMatchers(HttpMethod.PUT,    "/api/frequencias/**").hasRole("SECRETARIA")
              .requestMatchers(HttpMethod.DELETE, "/api/frequencias/**").hasRole("SECRETARIA")
              .requestMatchers(HttpMethod.GET,    "/api/frequencias/**").authenticated()

              // ─── ENDPOINTS DE NOTA ──────────────────────────
              .requestMatchers(HttpMethod.POST,   "/api/notas").hasRole("SECRETARIA")
              .requestMatchers(HttpMethod.PUT,    "/api/notas/**").hasRole("SECRETARIA")
              .requestMatchers(HttpMethod.DELETE, "/api/notas/**").hasRole("SECRETARIA")
              .requestMatchers(HttpMethod.GET,    "/api/notas/**").authenticated()

              // ─── QUALQUER OUTRA ROTA ────────────────────────
              .anyRequest().authenticated()
          )
          .sessionManagement(sm ->
              sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
          )
          .addFilterBefore(
              new JwtFilter(jwtUtil),
              UsernamePasswordAuthenticationFilter.class
          )
          .headers(headers ->
              headers.frameOptions().disable()
          );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cfg = new CorsConfiguration();
        cfg.setAllowedOriginPatterns(List.of("http://localhost:3000", "http://localhost:8081", "exp://*"));
        cfg.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));
        cfg.setAllowedHeaders(List.of("*"));
        cfg.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg);
        return source;
    }
}
