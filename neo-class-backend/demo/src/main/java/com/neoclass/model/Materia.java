package com.neoclass.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "materia")
@Data @NoArgsConstructor @AllArgsConstructor
public class Materia {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private Integer bimestre;

    @ManyToOne
    @JoinColumn(name = "professor_id")
    private Professor professor;

    @ManyToOne
    @JoinColumn(name = "turma_id")
    private Turma turma;
}
