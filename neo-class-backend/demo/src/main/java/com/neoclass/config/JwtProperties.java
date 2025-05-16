// src/main/java/com/neoclass/config/JwtProperties.java
package com.neoclass.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import lombok.Data;

@Component
@ConfigurationProperties(prefix = "jwt")
@Data
public class JwtProperties {
    /** must be at least 256 bits for HS256 */
    private String secret;
}
