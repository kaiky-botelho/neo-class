package com.neoclass.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "nota")
@Data @NoArgsConstructor @AllArgsConstructor
public class Nota {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Integer bimestre;
    private Double valor;

    @ManyToOne @JoinColumn(name = "turma_id")
    private Turma turma;

    @ManyToOne @JoinColumn(name = "aluno_id")
    private Aluno aluno;
    
    @ManyToOne @JoinColumn(name = "materia_id")
    private Materia materia;
}
