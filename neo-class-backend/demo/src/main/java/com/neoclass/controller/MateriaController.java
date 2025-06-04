// src/main/java/com/neoclass/controller/MateriaController.java
package com.neoclass.controller;

import com.neoclass.dto.MateriaDTO;
import com.neoclass.model.Materia;
import com.neoclass.model.Professor;
import com.neoclass.model.Turma;
import com.neoclass.service.MateriaService;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/materias")
public class MateriaController {

    private final MateriaService service;

    public MateriaController(MateriaService service) {
        this.service = service;
    }

    @GetMapping
    public List<MateriaDTO> listar() {
        return service.listarTodos().stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public MateriaDTO buscar(@PathVariable Long id) {
        return toDTO(service.buscarPorId(id));
    }

    @PostMapping
    public MateriaDTO criar(@RequestBody MateriaDTO dto) {
        Materia entidade = toEntity(dto);
        Materia salvo    = service.salvar(entidade);
        return toDTO(salvo);
    }

    @PutMapping("/{id}")
    public MateriaDTO atualizar(
            @PathVariable Long id,
            @RequestBody MateriaDTO dto
    ) {
        Materia entidade = toEntity(dto);
        entidade.setId(id);
        Materia atualizado = service.salvar(entidade);
        return toDTO(atualizado);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        service.excluir(id);
    }

    // ——— Conversor de Entidade → DTO ———
    private MateriaDTO toDTO(Materia m) {
        MateriaDTO dto = new MateriaDTO();
        BeanUtils.copyProperties(m, dto);
        if (m.getProfessor() != null) {
            dto.setProfessorId(m.getProfessor().getId());
        }
        if (m.getTurma() != null) {
            dto.setTurmaId(m.getTurma().getId());
        }
        return dto;
    }

    // ——— Conversor de DTO → Entidade ———
    private Materia toEntity(MateriaDTO dto) {
        Materia m = new Materia();
        BeanUtils.copyProperties(dto, m);
        if (dto.getProfessorId() != null) {
            Professor p = new Professor();
            p.setId(dto.getProfessorId());
            m.setProfessor(p);
        }
        if (dto.getTurmaId() != null) {
            Turma t = new Turma();
            t.setId(dto.getTurmaId());
            m.setTurma(t);
        }
        return m;
    }
}
