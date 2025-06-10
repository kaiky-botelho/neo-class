package com.neoclass.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChangePasswordRequestDTO {
    private String novaSenha;
    // Opcional: Se você quiser que o usuário digite a senha antiga para confirmar.
    // private String senhaAntiga;
}