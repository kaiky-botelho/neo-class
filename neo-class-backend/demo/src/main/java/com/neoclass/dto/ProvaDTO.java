// src/main/java/com/neoclass/dto/ProvaDTO.java
package com.neoclass.dto;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;

@Data
public class ProvaDTO {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;

    private String nome;
    private Integer bimestre;
    private LocalDate data;
    private Double nota;
    private Long professorId;
    private Long materiaId;
    private Long turmaId;
}
