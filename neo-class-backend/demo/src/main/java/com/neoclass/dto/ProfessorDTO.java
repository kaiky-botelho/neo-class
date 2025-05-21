// src/main/java/com/neoclass/dto/ProfessorDTO.java
package com.neoclass.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ProfessorDTO {
    private Long id;
    private String nome;
    private LocalDate dataNascimento;
    private String rg;
    private String cpf;
    private String estadoCivil;
    private String celular;
    private String telefone;
    private String email;
    private String genero;
    private String cep;
    private String uf;
    private String cidade;
    private String rua;
    private String numero;
    private String complemento;
    private String bairro;
    private String areaFormacao;
    private String situacaoContrato;
    private String emailInstitucional;
    private String senha;
}
