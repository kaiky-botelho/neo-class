// src/main/java/com/neoclass/dto/AlunoResumoDTO.java
package com.neoclass.dto;

public class AlunoResumoDTO {
    private Long id;
    private String nome;
    private String emailInstitucional;
    private Long turmaId;

    public AlunoResumoDTO() {}

    public AlunoResumoDTO(Long id, String nome, String emailInstitucional, Long turmaId) {
        this.id = id;
        this.nome = nome;
        this.emailInstitucional = emailInstitucional;
        this.turmaId = turmaId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmailInstitucional() {
        return emailInstitucional;
    }

    public void setEmailInstitucional(String emailInstitucional) {
        this.emailInstitucional = emailInstitucional;
    }

    public Long getTurmaId() {
        return turmaId;
    }

    public void setTurmaId(Long turmaId) {
        this.turmaId = turmaId;
    }
}
