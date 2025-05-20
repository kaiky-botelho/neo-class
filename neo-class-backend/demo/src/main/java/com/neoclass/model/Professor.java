package com.neoclass.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "professor")
@Data @NoArgsConstructor @AllArgsConstructor
public class Professor {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    @Column(name = "data_nascimento") private LocalDate dataNascimento;
    private String rg;
    private String cpf;
    @Column(name = "estado_civil") private String estadoCivil;
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
    @Column(name = "area_formacao") private String areaFormacao;
    @Column(name = "situacao_contrato") private String situacaoContrato;
    @Column(name = "email_institucional") private String emailInstitucional;
    private String senha;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "turma_id")
    private Turma turma;
}
