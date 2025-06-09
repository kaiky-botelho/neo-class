// src/main/java/com/neoclass/security/SecurityConfig.java
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
            // 1) Habilita CORS
            .cors().and()

            // 2) Desativa CSRF (REST stateless)
            .csrf().disable()

            // 3) Configura quem é público e quem exige token
            .authorizeHttpRequests(auth -> auth
                // cadastro de secretaria
                .requestMatchers(HttpMethod.POST, "/api/secretarias").permitAll()

                // APIs de login
                .requestMatchers(HttpMethod.POST, "/api/login/secretaria").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/login/aluno").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/login/professor").permitAll()

                // Swagger/OpenAPI
                .requestMatchers("/v3/api-docs/**", "/swagger-ui.html", "/swagger-ui/**").permitAll()

                // preflight CORS
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // Exemplo de rota protegida por ROLE
                // Apenas secretarias podem acessar /api/secretarias/admin (GET)
                .requestMatchers(HttpMethod.GET, "/api/secretarias/admin").hasRole("SECRETARIA")
                // Apenas alunos podem acessar /api/alunos/meus-cursos (GET)
                .requestMatchers(HttpMethod.GET, "/api/alunos/meus-cursos").hasRole("ALUNO")
                // Apenas professores podem acessar /api/professores/minhas-turmas (GET)
                .requestMatchers(HttpMethod.GET, "/api/professores/minhas-turmas").hasRole("PROFESSOR")


                // todas as outras rotas precisam de JWT válido (e ter as roles necessárias, se definido)
                .anyRequest().authenticated()
            )

            // 4) Stateless session
            .sessionManagement(sm ->
                sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            // 5) Nosso filtro JWT antes do UsernamePasswordAuthenticationFilter
            .addFilterBefore(
                new JwtFilter(jwtUtil),
                UsernamePasswordAuthenticationFilter.class
            )

            // 6) Para permitir console H2 (se usar)
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
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("http://localhost:3000", "http://localhost:8081"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}