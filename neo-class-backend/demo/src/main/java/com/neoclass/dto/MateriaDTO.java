// src/main/java/com/neoclass/dto/MateriaDTO.java
package com.neoclass.dto;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

@Data
public class MateriaDTO {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;

    private String nome;
    private Integer bimestre;
    private Long professorId;
    private Long turmaId;
}
