// src/main/java/com/neoclass/controller/FrequenciaController.java
package com.neoclass.controller;

import com.neoclass.dto.FaltaDTO;
import com.neoclass.dto.FrequenciaDTO;
import com.neoclass.model.Frequencia;
import com.neoclass.service.FrequenciaService;
import org.springframework.beans.BeanUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/frequencias")
public class FrequenciaController {

    private final FrequenciaService frequenciaService;

    public FrequenciaController(FrequenciaService frequenciaService) {
        this.frequenciaService = frequenciaService;
    }

    /** GET /api/frequencias — lista todas as frequências */
    @GetMapping
    public List<FrequenciaDTO> listarTodas() {
        return frequenciaService.listarTodos()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /** GET /api/frequencias/{id} — busca uma frequência específica */
    @GetMapping("/{id}")
    public FrequenciaDTO buscarPorId(@PathVariable Long id) {
        Frequencia f = frequenciaService.buscarPorId(id);
        return toDTO(f);
    }

    /** POST /api/frequencias — cria uma nova frequência */
    @PostMapping
    public FrequenciaDTO criar(@RequestBody FrequenciaDTO dto) {
        Frequencia salvo = frequenciaService.criarFrequencia(dto);
        return toDTO(salvo);
    }

    /** PUT /api/frequencias/{id} — atualiza uma frequência existente */
    @PutMapping("/{id}")
    public FrequenciaDTO atualizar(
            @PathVariable Long id,
            @RequestBody FrequenciaDTO dto
    ) {
        Frequencia atualizado = frequenciaService.atualizarFrequencia(id, dto);
        return toDTO(atualizado);
    }

    /** DELETE /api/frequencias/{id} — exclui uma frequência por ID */
    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        frequenciaService.excluir(id);
    }

    // ────────────────────────────────────────────────────────────────────
    // NOVO ENDPOINT: /api/frequencias/faltas/{alunoId}
    // → retorna lista de FaltaDTO agrupadas por matéria para aquele aluno
    // ────────────────────────────────────────────────────────────────────
    @GetMapping("/faltas/{alunoId}")
    public ResponseEntity<List<FaltaDTO>> listarFaltasPorAluno(@PathVariable Long alunoId) {
        List<FaltaDTO> lista = frequenciaService.listarFaltasPorAluno(alunoId);
        return ResponseEntity.ok(lista);
    }

    // ——— Conversor de ENTIDADE → DTO ———
    private FrequenciaDTO toDTO(Frequencia f) {
        FrequenciaDTO dto = new FrequenciaDTO();
        BeanUtils.copyProperties(f, dto);
        if (f.getAluno() != null) {
            dto.setAlunoId(f.getAluno().getId());
        }
        if (f.getTurma() != null) {
            dto.setTurmaId(f.getTurma().getId());
        }
        if (f.getMateria() != null) {
            dto.setMateriaId(f.getMateria().getId());
        }
        return dto;
    }
}
