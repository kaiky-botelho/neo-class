// src/main/java/com/neoclass/dto/NotaDTO.java
package com.neoclass.dto;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

@Data
public class NotaDTO {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;

    private Integer bimestre;
    private Double valor;
    private Long turmaId;
    private Long alunoId;
    private Long materiaId;
}
