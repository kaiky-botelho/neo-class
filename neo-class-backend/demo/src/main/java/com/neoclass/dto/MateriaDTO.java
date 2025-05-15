// src/main/java/com/neoclass/dto/MateriaDTO.java
package com.neoclass.dto;

import lombok.Data;

@Data
public class MateriaDTO {
    private Long id;
    private String nome;
    private Integer bimestre;
    private Long professorId;
    private Long turmaId;
}

