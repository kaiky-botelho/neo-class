// src/main/java/com/neoclass/controller/FrequenciaController.java
package com.neoclass.controller;

import com.neoclass.dto.FrequenciaDTO;
import com.neoclass.model.Frequencia;
import com.neoclass.model.Aluno;
import com.neoclass.model.Turma;
import com.neoclass.model.Materia;
import com.neoclass.service.FrequenciaService;
import org.springframework.beans.BeanUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class FrequenciaController {

    private final FrequenciaService service;

    public FrequenciaController(FrequenciaService service) {
        this.service = service;
    }

    // ================================================================
    // CRUD SIMPLES (GET /api/frequencias, POST, PUT, DELETE)
    // ================================================================
    @GetMapping("/frequencias")
    public List<FrequenciaDTO> listarTodasFrequencias() {
        return service.listarTodos().stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    @GetMapping("/frequencias/{id}")
    public ResponseEntity<FrequenciaDTO> buscarFrequencia(@PathVariable Long id) {
        Frequencia f = service.buscarPorId(id);
        return ResponseEntity.ok(toDTO(f));
    }

    @PostMapping("/frequencias")
    public ResponseEntity<FrequenciaDTO> criarFrequencia(@RequestBody FrequenciaDTO dto) {
        Frequencia entidade = toEntity(dto);
        Frequencia salvo   = service.salvar(entidade);
        return ResponseEntity.ok(toDTO(salvo));
    }

    @PutMapping("/frequencias/{id}")
    public ResponseEntity<FrequenciaDTO> atualizarFrequencia(
            @PathVariable Long id,
            @RequestBody FrequenciaDTO dto
    ) {
        Frequencia entidade = toEntity(dto);
        entidade.setId(id);
        Frequencia atualizado = service.salvar(entidade);
        return ResponseEntity.ok(toDTO(atualizado));
    }

    @DeleteMapping("/frequencias/{id}")
    public ResponseEntity<Void> excluirFrequencia(@PathVariable Long id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }

    // ——— Helpers de mapeamento entre Frequencia ↔ FrequenciaDTO ———

    private FrequenciaDTO toDTO(Frequencia f) {
        FrequenciaDTO dto = new FrequenciaDTO();
        BeanUtils.copyProperties(f, dto);
        dto.setAlunoId(f.getAluno().getId());
        dto.setTurmaId(f.getTurma().getId());
        dto.setMateriaId(f.getMateria().getId());
        dto.setMateriaNome(f.getMateria().getNome()); // preenche o novo campo
        return dto;
    }

    private Frequencia toEntity(FrequenciaDTO dto) {
        Frequencia f = new Frequencia();
        BeanUtils.copyProperties(dto, f);
        if (dto.getAlunoId() != null) {
            Aluno a = new Aluno();
            a.setId(dto.getAlunoId());
            f.setAluno(a);
        }
        if (dto.getTurmaId() != null) {
            Turma t = new Turma();
            t.setId(dto.getTurmaId());
            f.setTurma(t);
        }
        if (dto.getMateriaId() != null) {
            Materia m = new Materia();
            m.setId(dto.getMateriaId());
            f.setMateria(m);
        }
        return f;
    }
}
