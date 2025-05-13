package com.neoclass.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "trabalho")
@Data @NoArgsConstructor @AllArgsConstructor
public class Trabalho {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private Integer bimestre;
    private LocalDate data;
    private Double nota;

    @ManyToOne
    @JoinColumn(name = "professor_id")
    private Professor professor;
}
