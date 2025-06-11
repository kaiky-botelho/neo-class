package com.neoclass.dto;

import jakarta.validation.constraints.NotBlank; // NOVO: Importar para validação
import jakarta.validation.constraints.Size;    // NOVO: Importar para validação
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChangePasswordRequestDTO {
    @NotBlank(message = "A nova senha não pode ser vazia.") // Garante que a senha não seja null ou vazia
    @Size(min = 6, message = "A nova senha deve ter no mínimo 6 caracteres.") // Garante o tamanho mínimo
    private String novaSenha;
}