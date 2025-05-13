package com.neoclass.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notificacao")
@Data @NoArgsConstructor @AllArgsConstructor
public class Notificacao {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String texto;

    @Column(name = "data_envio")
    private LocalDateTime dataEnvio;

    @ManyToOne @JoinColumn(name = "aluno_id", nullable = false)
    private Aluno aluno;
}
