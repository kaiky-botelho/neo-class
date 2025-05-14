// src/main/java/com/neoclass/controller/ProfessorController.java
package com.neoclass.controller;

import com.neoclass.dto.ProfessorDTO;
import com.neoclass.model.Professor;
import com.neoclass.model.Turma;
import com.neoclass.service.ProfessorService;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/professores")
public class ProfessorController {
    private final ProfessorService service;
    public ProfessorController(ProfessorService service) { this.service = service; }

    @GetMapping
    public List<ProfessorDTO> listar() {
        return service.listarTodos().stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ProfessorDTO buscar(@PathVariable Long id) {
        return toDTO(service.buscarPorId(id));
    }

    @PostMapping
    public ProfessorDTO criar(@RequestBody ProfessorDTO dto) {
        Professor entidade = toEntity(dto);
        Professor salvo   = service.salvar(entidade);
        return toDTO(salvo);
    }

    @PutMapping("/{id}")
    public ProfessorDTO atualizar(@PathVariable Long id, @RequestBody ProfessorDTO dto) {
        Professor entidade = toEntity(dto);
        entidade.setId(id);
        return toDTO(service.salvar(entidade));
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        service.excluir(id);
    }

    private ProfessorDTO toDTO(Professor p) {
        ProfessorDTO dto = new ProfessorDTO();
        BeanUtils.copyProperties(p, dto);
        if (p.getTurma() != null) dto.setTurmaId(p.getTurma().getId());
        return dto;
    }

    private Professor toEntity(ProfessorDTO dto) {
        Professor p = new Professor();
        BeanUtils.copyProperties(dto, p);
        if (dto.getTurmaId() != null) {
            Turma t = new Turma();
            t.setId(dto.getTurmaId());
            p.setTurma(t);
        }
        return p;
    }
}
