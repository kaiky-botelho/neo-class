// src/main/java/com/neoclass/dto/FrequenciaDTO.java
package com.neoclass.dto;

import java.time.LocalDate;

public class FrequenciaDTO {
    private Long      id;
    private LocalDate data;
    private Boolean   presente;
    private Long      alunoId;
    private Long      turmaId;
    private Long      materiaId;

    public FrequenciaDTO() {

    }

    public FrequenciaDTO(Long id, LocalDate data, Boolean presente, Long alunoId, Long turmaId, Long materiaId) {
        this.id         = id;
        this.data       = data;
        this.presente   = presente;
        this.alunoId    = alunoId;
        this.turmaId    = turmaId;
        this.materiaId  = materiaId;
    }



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
}
