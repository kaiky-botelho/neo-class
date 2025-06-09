package com.neoclass.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.Instant; // MUITO IMPORTANTE: Mudar de LocalDateTime para Instant

@Entity
@Table(name = "notificacao")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Notificacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String texto;

    @Column(name = "data_envio", nullable = false, updatable = false)
    // Usar Instant.now() para garantir que a data de criação no servidor seja UTC
    private Instant dataEnvio = Instant.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aluno_id", nullable = false)
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Aluno aluno;

    private String resposta;

    @Column(name = "data_resposta")
    private Instant dataResposta; // MUITO IMPORTANTE: Mudar de LocalDateTime para Instant

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "secretaria_id")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Secretaria secretaria;

    @Column(nullable = false)
    private String status = "PENDENTE";
}