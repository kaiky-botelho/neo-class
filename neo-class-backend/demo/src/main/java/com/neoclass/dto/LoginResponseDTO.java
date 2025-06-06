// src/main/java/com/neoclass/dto/LoginResponseDTO.java
package com.neoclass.dto;

public class LoginResponseDTO {
    private String token;
    private AlunoResumoDTO user;

    public LoginResponseDTO() {}

    public LoginResponseDTO(String token, AlunoResumoDTO user) {
        this.token = token;
        this.user  = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public AlunoResumoDTO getUser() {
        return user;
    }

    public void setUser(AlunoResumoDTO user) {
        this.user = user;
    }
}
