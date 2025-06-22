// src/main/java/com/neoclass/dto/LoginResponseDTO.java
package com.neoclass.dto;

import java.util.List;

public class LoginResponseDTO {
    private String token;
    private Object user;
    private List<String> roles; 

    public LoginResponseDTO() {}


    public LoginResponseDTO(String token, Object user) {
        this.token = token;
        this.user  = user;

    }

   
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


    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }
}