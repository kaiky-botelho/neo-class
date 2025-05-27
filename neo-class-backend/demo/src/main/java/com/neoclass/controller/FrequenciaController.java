// src/main/java/com/neoclass/controller/FrequenciaController.java
package com.neoclass.controller;

import com.neoclass.dto.FrequenciaDTO;
import com.neoclass.model.Frequencia;
import com.neoclass.model.Aluno;
import com.neoclass.model.Turma;
import com.neoclass.model.Materia;
import com.neoclass.service.FrequenciaService;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/frequencias")
public class FrequenciaController {
    private final FrequenciaService service;
    public FrequenciaController(FrequenciaService service) {
        this.service = service;
    }

    @GetMapping
    public List<FrequenciaDTO> listar() {
        return service.listarTodos().stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public FrequenciaDTO buscar(@PathVariable Long id) {
        return toDTO(service.buscarPorId(id));
    }

    @PostMapping
    public FrequenciaDTO criar(@RequestBody FrequenciaDTO dto) {
        Frequencia entidade = toEntity(dto);
        Frequencia salvo   = service.salvar(entidade);
        return toDTO(salvo);
    }

    @PutMapping("/{id}")
    public FrequenciaDTO atualizar(@PathVariable Long id,
                                   @RequestBody FrequenciaDTO dto) {
        Frequencia entidade = toEntity(dto);
        entidade.setId(id);
        return toDTO(service.salvar(entidade));
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        service.excluir(id);
    }

    // ——— Helpers de mapeamento ———
    private FrequenciaDTO toDTO(Frequencia f) {
        FrequenciaDTO dto = new FrequenciaDTO();
        BeanUtils.copyProperties(f, dto);
        dto.setAlunoId(f.getAluno().getId());
        dto.setTurmaId(f.getTurma().getId());
        dto.setMateriaId(f.getMateria().getId());
        return dto;
    }

    private Frequencia toEntity(FrequenciaDTO dto) {
        Frequencia f = new Frequencia();
        BeanUtils.copyProperties(dto, f);
        if (dto.getAlunoId() != null) {
            Aluno a = new Aluno(); a.setId(dto.getAlunoId());
            f.setAluno(a);
        }
        if (dto.getTurmaId() != null) {
            Turma t = new Turma(); t.setId(dto.getTurmaId());
            f.setTurma(t);
        }
        if (dto.getMateriaId() != null) {
            Materia m = new Materia(); m.setId(dto.getMateriaId());
            f.setMateria(m);
        }
        return f;
    }
}
