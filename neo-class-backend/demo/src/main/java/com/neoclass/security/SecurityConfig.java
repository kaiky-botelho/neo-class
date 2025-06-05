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
          // 1) Habilita CORS (usa o corsConfigurationSource abaixo)
          .cors().and()

          // 2) Desativa CSRF (para chamadas REST simples)
          .csrf().disable()

          // 3) Configura quais rotas são públicas e quais exigem token
          .authorizeHttpRequests(auth -> auth
              // permite POST em /api/secretarias sem token
              .requestMatchers(HttpMethod.POST, "/api/secretarias").permitAll()

              // permite qualquer POST em /api/login/** sem token
              .requestMatchers(HttpMethod.POST, "/api/login/**").permitAll()

              // permite acesso às rotas do Swagger/OpenAPI sem token
              .requestMatchers(
                  "/v3/api-docs/**",
                  "/swagger-ui.html",
                  "/swagger-ui/**"
              ).permitAll()

              // permite OPTIONS (preflight) em qualquer rota
              .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

              // permite GET /api/frequencias/faltas/** se o usuário estiver autenticado
              // (na verdade, como o usuário deve enviar JWT válido no header, 
              //  essa rota não precisa ser “permitAll” se você quer obrigar token;
              //  mas vamos exigir autenticação)
              .requestMatchers(HttpMethod.GET, "/api/frequencias/faltas/**").authenticated()

              // todas as demais rotas exigem token
              .anyRequest().authenticated()
          )

          // 4) Define que não haverá sessão HTTP (stateless)
          .sessionManagement(sm ->
              sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
          )

          // 5) Adiciona o JwtFilter para validar token antes do filtro padrão
          .addFilterBefore(
              new JwtFilter(jwtUtil),
              UsernamePasswordAuthenticationFilter.class
          )

          // 6) (caso use console H2 ou algo semelhante)
          .headers(headers ->
              headers.frameOptions().disable()
          );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // 1) Adicione aqui as origens que podem chamar sua API
        //    (Ex.: front ReactJS ou Expo Go)
        config.setAllowedOriginPatterns(List.of(
            "http://localhost:3000",  // React Web (desenvolvimento)
            "http://localhost:8081"   // Expo Web / React Native Web
            // adicione “http://10.0.2.2:8080” se quiser permitir diretamente do emulador Android
        ));

        // 2) Métodos HTTP permitidos
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // 3) Quais headers o cliente pode enviar
        config.setAllowedHeaders(List.of("*"));

        // 4) Permitir envio de credenciais (cookies, Authorization header etc.)
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Aplica esta configuração a TODAS as rotas
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
