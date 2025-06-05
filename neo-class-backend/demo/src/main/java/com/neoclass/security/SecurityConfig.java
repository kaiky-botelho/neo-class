// src/main/java/com/neoclass/security/SecurityConfig.java
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
          .cors()                        // Habilita CORS usando o corsConfigurationSource()
          .and()
          .csrf().disable()              // Desativa CSRF para APIs REST
          .authorizeHttpRequests(auth -> auth
              // 1) Liberar qualquer requisição POST para criar nova SECRETARIA
              .requestMatchers(HttpMethod.POST, "/api/secretarias").permitAll()

              // 2) Se houver endpoint de login na rota /api/login, já estava liberado:
              .requestMatchers(HttpMethod.POST, "/api/login/**").permitAll()

              // 3) Se você tiver cadastro de aluno/public signup para aluno, libere aqui, por ex:
              // .requestMatchers(HttpMethod.POST, "/api/alunos").permitAll()
              // .requestMatchers(HttpMethod.POST, "/api/alunos/login").permitAll()

              // 4) Liberar o Swagger/OpenAPI sem autenticação
              .requestMatchers(
                  "/v3/api-docs/**",
                  "/swagger-ui.html",
                  "/swagger-ui/**"
              ).permitAll()

              // 5) Todas as outras rotas exigem autenticação
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
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // Permitir frontends em React e Expo:
        config.setAllowedOriginPatterns(List.of(
            "http://localhost:3000",   // React Web
            "http://localhost:8081"    // Expo Web / React Native Web (Metro)
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
