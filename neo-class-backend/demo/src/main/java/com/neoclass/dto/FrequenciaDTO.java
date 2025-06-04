// src/main/java/com/neoclass/dto/FrequenciaDTO.java
package com.neoclass.dto;

import java.time.LocalDate;

public class FrequenciaDTO {
    private Long id;
    private LocalDate data;
    private Boolean presente;
    private Long alunoId;
    private Long turmaId;
    private Long materiaId;
    private String materiaNome; // novo campo

    // ——— Getters e setters existentes ———

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getData() {
        return data;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }

    public Boolean getPresente() {
        return presente;
    }

    public void setPresente(Boolean presente) {
        this.presente = presente;
    }

    public Long getAlunoId() {
        return alunoId;
    }

    public void setAlunoId(Long alunoId) {
        this.alunoId = alunoId;
    }

    public Long getTurmaId() {
        return turmaId;
    }

    public void setTurmaId(Long turmaId) {
        this.turmaId = turmaId;
    }

    public Long getMateriaId() {
        return materiaId;
    }

    public void setMateriaId(Long materiaId) {
        this.materiaId = materiaId;
    }

    // ——— Novo getter e setter para materiaNome ———

    public String getMateriaNome() {
        return materiaNome;
    }

    public void setMateriaNome(String materiaNome) {
        this.materiaNome = materiaNome;
    }
}
