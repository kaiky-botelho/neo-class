package com.neoclass.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuração adicional de CORS para toda a aplicação (WebMvc).
 * Isso garante que se algum endpoint não passar pelo SecurityConfig, 
 * o CORS ainda estará habilitado.
 */
@Configuration
public class webConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry
                  .addMapping("/**") // todas as rotas
                  .allowedOrigins("http://localhost:3000")
                  .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                  .allowedHeaders("*")
                  .allowCredentials(true);
            }
        };
    }
}
