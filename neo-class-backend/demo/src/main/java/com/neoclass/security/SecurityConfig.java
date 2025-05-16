// src/main/java/com/neoclass/security/SecurityConfig.java
package com.neoclass.security;

import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.*;
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
              // libera o cadastro de secretaria
              .requestMatchers(HttpMethod.POST, "/api/secretarias").permitAll()
              // libera login e console
              .requestMatchers("/api/login", "/h2-console/**").permitAll()
              // todo o resto fica protegido
              .anyRequest().authenticated()
          )
          .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
          .addFilterBefore(new JwtFilter(jwtUtil),
                           UsernamePasswordAuthenticationFilter.class)
          // pra permitir o frame do H2
          .headers(headers -> headers.frameOptions().disable());

        return http.build();
    }
}
