package com.neoclass.dto;

import lombok.Data;
import java.time.Instant; // MUITO IMPORTANTE: Mudar de LocalDateTime para Instant

@Data
public class NotificacaoDTO {
    private Long id;
    private String texto;
    private Instant dataEnvio; // MUITO IMPORTANTE: Mudar de LocalDateTime para Instant
    private Long alunoId;
    private String resposta;
    private Instant dataResposta; // MUITO IMPORTANTE: Mudar de LocalDateTime para Instant
    private Long secretariaId;
    private String status;
}