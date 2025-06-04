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
          .cors()                        // Habilita CORS usando corsConfigurationSource()
          .and()
          .csrf().disable()              // Desativa CSRF para APIs REST
          .authorizeHttpRequests(auth -> auth
              .requestMatchers(HttpMethod.POST, "/api/login/**").permitAll()
              .requestMatchers(
                  "/v3/api-docs/**",
                  "/swagger-ui.html",
                  "/swagger-ui/**"
              ).permitAll()
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
            "http://localhost:3000",   // React Web, se existir
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
