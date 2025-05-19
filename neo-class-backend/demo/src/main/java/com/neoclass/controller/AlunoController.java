// src/main/java/com/neoclass/controller/AlunoController.java
package com.neoclass.controller;

import com.neoclass.dto.AlunoDTO;
import com.neoclass.model.Aluno;
import com.neoclass.model.Turma;
import com.neoclass.service.AlunoService;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/alunos")
public class AlunoController {

    private final AlunoService service;

    public AlunoController(AlunoService service) {
        this.service = service;
    }

    @GetMapping
    public List<AlunoDTO> listar() {
        return service.listarTodos()
                      .stream()
                      .map(this::toDTO)
                      .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public AlunoDTO buscar(@PathVariable Long id) {
        return toDTO(service.buscarPorId(id));
    }

    @PostMapping
    public AlunoDTO criar(@RequestBody AlunoDTO dto) {
        Aluno entidade = toEntity(dto);
        Aluno salvo   = service.salvar(entidade);
        return toDTO(salvo);
    }

    @PutMapping("/{id}")
    public AlunoDTO atualizar(
        @PathVariable Long id,
        @RequestBody AlunoDTO dto
    ) {
        Aluno entidade = toEntity(dto);
        entidade.setId(id);
        return toDTO(service.salvar(entidade));
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        service.excluir(id);
    }

    // —–– Conversores entre entidade e DTO —––
    private AlunoDTO toDTO(Aluno a) {
        AlunoDTO dto = new AlunoDTO();
        BeanUtils.copyProperties(a, dto);
        if (a.getTurma() != null) {
            dto.setTurmaId(a.getTurma().getId());
        }
        return dto;
    }

    private Aluno toEntity(AlunoDTO dto) {
        Aluno a = new Aluno();
        BeanUtils.copyProperties(dto, a);
        if (dto.getTurmaId() != null) {
            Turma t = new Turma();
            t.setId(dto.getTurmaId());
            a.setTurma(t);
        }
        return a;
    }
}
