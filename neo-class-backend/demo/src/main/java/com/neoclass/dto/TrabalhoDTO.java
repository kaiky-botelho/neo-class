// src/main/java/com/neoclass/dto/TrabalhoDTO.java
package com.neoclass.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class TrabalhoDTO {
    private Long id;
    private String nome;
    private Integer bimestre;
    private LocalDate data;
    private Double nota;
    private Long professorId;
    private Long materiaId;
    private Long turmaId;
}
