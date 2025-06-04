// src/main/java/com/neoclass/dto/AuthRequestDTO.java
package com.neoclass.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthRequestDTO {
    /**
     * Para secretaria e professor aqui vai o e-mail normal,
     * para alunos deve ser enviado o campo email_institucional.
     */
    private String email;
    private String senha;
}
