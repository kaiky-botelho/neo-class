// src/main/java/com/neoclass/controller/FrequenciaController.java
package com.neoclass.controller;

import com.neoclass.dto.FaltaDTO;
import com.neoclass.model.Aluno;
import com.neoclass.service.AlunoService;
import com.neoclass.service.FrequenciaService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class FrequenciaController {

    private final FrequenciaService frequenciaService;
    private final AlunoService      alunoService;

    public FrequenciaController(
            FrequenciaService frequenciaService,
            AlunoService alunoService
    ) {
        this.frequenciaService = frequenciaService;
        this.alunoService      = alunoService;
    }

    /**
     * GET /api/faltas
     * • Extrai o e‐mail do JWT via Authentication.getPrincipal()
     * • Busca o Aluno completo (_contendo o ID_) a partir do e‐mail
     * • Chama o FrequenciaService.listarFaltasPorAluno(alunoId) para obter List<FaltaDTO>
     */
    @GetMapping("/faltas")
    public ResponseEntity<List<FaltaDTO>> listarFaltasDoAlunoLogado(
            Authentication authentication
    ) {
        // 1) principal() do Authentication = o "sub" do token (que configuramos como emailInstitucional)
        String emailDoAluno = authentication.getPrincipal().toString();

        // 2) Busca a entidade Aluno pelo e‐mail
        Aluno aluno = alunoService.buscarPorEmailInstitucional(emailDoAluno);
        Long alunoId = aluno.getId();

        // 3) Lista as faltas por matéria para aquele aluno
        List<FaltaDTO> lista = frequenciaService.listarFaltasPorAluno(alunoId);
        return ResponseEntity.ok(lista);
    }
}
