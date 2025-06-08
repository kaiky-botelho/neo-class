// src/main/java/com/neoclass/dto/ProfessorResumoDTO.java
package com.neoclass.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfessorResumoDTO {
    private Long id;
    private String nome;
    private String emailInstitucional;
}
