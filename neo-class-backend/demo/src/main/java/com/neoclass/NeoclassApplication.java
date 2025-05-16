package com.neoclass;

import com.neoclass.config.JwtProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(JwtProperties.class)
public class NeoclassApplication {

    public static void main(String[] args) {
        SpringApplication.run(NeoclassApplication.class, args);
    }

}
