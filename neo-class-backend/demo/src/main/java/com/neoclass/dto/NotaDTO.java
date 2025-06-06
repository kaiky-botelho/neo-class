// src/main/java/com/neoclass/dto/NotaDTO.java
package com.neoclass.dto;

import lombok.Data;

@Data
public class NotaDTO {
    private Long id;
    private Integer bimestre;
    private Double valor;
    private Long turmaId;
    private Long alunoId;
    private Long materiaId;
}
