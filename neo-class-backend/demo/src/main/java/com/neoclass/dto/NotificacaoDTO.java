package com.neoclass.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class NotificacaoDTO {
    private Long id;
    private String texto;
    private LocalDateTime dataEnvio;
    private Long alunoId;
    private String resposta;
    private LocalDateTime dataResposta;
    private Long secretariaId;
    private String status;
}