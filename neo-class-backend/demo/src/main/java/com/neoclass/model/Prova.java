package com.neoclass.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "prova")
@Data @NoArgsConstructor @AllArgsConstructor
public class Prova {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Integer bimestre;
    private LocalDate data;
    private Double nota;

    @ManyToOne @JoinColumn(name = "professor_id")
    private Professor professor;

    @ManyToOne @JoinColumn(name = "materia_id")
    private Materia materia;

    @ManyToOne
    @JoinColumn(name = "turma_id")
    private Turma turma;
}
