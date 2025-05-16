// src/main/java/com/neoclass/dto/LoginDTO.java
package com.neoclass.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginDTO {
    private String email;
    private String senha;
}
