package com.neoclass.dto;

import lombok.Data;
import java.time.Instant; 
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

@Data
public class NotificacaoDTO {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;

    private String texto;
    private Instant dataEnvio; 
    private Long alunoId;
    private String resposta;
    private Instant dataResposta; 
    private Long secretariaId;
    private String status;
}
