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

    public Turma(Long id) {
        this.id = id;
    }
}
