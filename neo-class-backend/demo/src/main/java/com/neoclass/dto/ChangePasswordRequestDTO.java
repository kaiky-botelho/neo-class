package com.neoclass.dto;

import jakarta.validation.constraints.NotBlank; 
import jakarta.validation.constraints.Size;    
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChangePasswordRequestDTO {
    @NotBlank(message = "A nova senha não pode ser vazia.") 
    @Size(min = 6, message = "A nova senha deve ter no mínimo 6 caracteres.") 
    private String novaSenha;
}