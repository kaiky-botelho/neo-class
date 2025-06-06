// src/main/java/com/neoclass/model/Aluno.java
package com.neoclass.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "aluno")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Aluno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @Column(name = "data_nascimento")
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

    @Column(name = "data_matricula")
    private LocalDate dataMatricula;

    @Column(name = "situacao_matricula")
    private String situacaoMatricula;

    @Column(name = "email_institucional")
    private String emailInstitucional;

    private String senha;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "turma_id")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Turma turma;
}
