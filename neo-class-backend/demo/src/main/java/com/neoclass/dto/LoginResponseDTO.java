// src/main/java/com/neoclass/dto/LoginResponseDTO.java
package com.neoclass.dto;

import java.util.List; // Importar List para o campo 'roles'

/**
 * O campo 'user' agora é genérico (Object), para suportar SecretariaDTO,
 * AlunoResumoDTO ou ProfessorResumoDTO conforme o caso.
 * Este DTO também inclui uma lista de 'roles' para informar os papéis do usuário.
 */
public class LoginResponseDTO {
    private String token;
    private Object user;
    private List<String> roles; // NOVO CAMPO: Para retornar os papéis no JSON de resposta

    public LoginResponseDTO() {}

    // Construtor original, mantido por compatibilidade se necessário, mas o novo será mais usado
    public LoginResponseDTO(String token, Object user) {
        this.token = token;
        this.user  = user;
        // Papéis não são definidos aqui, podem ser nulos ou uma lista vazia por padrão
    }

    // NOVO CONSTRUTOR: Inclui a lista de papéis
    public LoginResponseDTO(String token, Object user, List<String> roles) {
        this.token = token;
        this.user  = user;
        this.roles = roles;
    }

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

    // Getter e Setter para o novo campo 'roles'
    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }
}