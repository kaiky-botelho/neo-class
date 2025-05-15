// src/main/java/com/neoclass/dto/TurmaDTO.java
package com.neoclass.dto;

import lombok.Data;

@Data
public class TurmaDTO {
    private Long id;
    private String nome;
    private Integer anoLetivo;
    private String serie;
    private String turno;
    private Integer capacidade;
    private String sala;
}
