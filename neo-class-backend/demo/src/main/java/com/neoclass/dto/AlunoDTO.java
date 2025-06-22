// src/main/java/com/neoclass/dto/AlunoDTO.java
package com.neoclass.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class AlunoDTO {
    private Long id;
    private String nome;
    private LocalDate dataNascimento;
    private String rg;
    private String cpf;
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
    private String serie;
    private LocalDate dataMatricula;
    private String situacaoMatricula;
    private String emailInstitucional;
    private String senha;
    private Long turmaId;       
}
