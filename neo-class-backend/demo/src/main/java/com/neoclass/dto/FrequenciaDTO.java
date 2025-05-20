// src/main/java/com/neoclass/dto/FrequenciaDTO.java
package com.neoclass.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data @NoArgsConstructor
public class FrequenciaDTO {
    private Long id;
    private LocalDate data;
    private Boolean presente;
    private Long alunoId;
    private Long turmaId;
    private Long materiaId;
}
