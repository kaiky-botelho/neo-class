// src/main/java/com/neoclass/dto/LoginResponseDTO.java
package com.neoclass.dto;

/**
 * O campo 'user' agora é genérico (Object), para suportar SecretariaDTO,
 * AlunoResumoDTO ou ProfessorResumoDTO conforme o caso.
 */
public class LoginResponseDTO {
    private String token;
    private Object user;

    public LoginResponseDTO() {}

    public LoginResponseDTO(String token, Object user) {
        this.token = token;
        this.user  = user;
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
}
