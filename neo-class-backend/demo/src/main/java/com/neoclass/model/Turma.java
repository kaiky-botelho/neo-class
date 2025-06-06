// src/main/java/com/neoclass/model/Turma.java
package com.neoclass.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
@Entity
@Table(name = "turma")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Turma {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @Column(name = "ano_letivo")
    private Integer anoLetivo;

    private String serie;
    private String turno;
    private String sala;

    /**
     * Construtor auxiliar que aceita apenas ID, para podermos montar o objeto Turma
     * mesmo sem precisar buscar toda a entidade do banco (útil ao associar no Aluno).
     */
    public Turma(Long id) {
        this.id = id;
    }
}
