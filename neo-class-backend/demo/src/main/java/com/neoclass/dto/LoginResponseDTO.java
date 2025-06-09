// src/main/java/com/neoclass/dto/LoginResponseDTO.java
package com.neoclass.dto;

import java.util.List;  // Import para List

/**
 * O campo 'user' agora é genérico (Object), para suportar
 * SecretariaDTO, AlunoResumoDTO ou ProfessorResumoDTO conforme o caso.
 * Este DTO também inclui uma lista de 'roles' para informar os papéis do usuário.
 */
public class LoginResponseDTO {
    private String token;
    private Object user;
    private List<String> roles;  // Campo para retornar os papéis no JSON de resposta

    public LoginResponseDTO() {}

    /**
     * Construtor legado: só token e user.
     */
    public LoginResponseDTO(String token, Object user) {
        this.token = token;
        this.user  = user;
    }

    /**
     * Construtor principal: token, user e lista de papéis.
     */
    public LoginResponseDTO(String token, Object user, List<String> roles) {
        this.token = token;
        this.user  = user;
        this.roles = roles;
    }

    // Getters e setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Object getUser() {
        return user;
    }

    public void setUser(Object user) {
        this.user = user;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }
}
