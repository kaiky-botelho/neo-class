// src/main/java/com/neoclass/dto/AuthRequestDTO.java
package com.neoclass.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class AuthRequestDTO {
    private String email;
    private String senha;
}
