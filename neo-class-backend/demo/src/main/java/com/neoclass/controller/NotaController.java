// src/main/java/com/neoclass/controller/NotaController.java
package com.neoclass.controller;

import com.neoclass.dto.NotaDTO;
import com.neoclass.model.Nota;
import com.neoclass.model.Turma;
import com.neoclass.model.Aluno;
import com.neoclass.service.NotaService;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notas")
public class NotaController {
    private final NotaService service;
    public NotaController(NotaService service) { this.service = service; }

    @GetMapping
    public List<NotaDTO> listar() {
        return service.listarTodos().stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public NotaDTO buscar(@PathVariable Long id) {
        return toDTO(service.buscarPorId(id));
    }

    @PostMapping
    public NotaDTO criar(@RequestBody NotaDTO dto) {
        Nota entidade = toEntity(dto);
        Nota salvo   = service.salvar(entidade);
        return toDTO(salvo);
    }

    @PutMapping("/{id}")
    public NotaDTO atualizar(@PathVariable Long id, @RequestBody NotaDTO dto) {
        Nota entidade = toEntity(dto);
        entidade.setId(id);
        return toDTO(service.salvar(entidade));
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        service.excluir(id);
    }

    private NotaDTO toDTO(Nota n) {
        NotaDTO dto = new NotaDTO();
        BeanUtils.copyProperties(n, dto);
        if (n.getTurma() != null) dto.setTurmaId(n.getTurma().getId());
        if (n.getAluno() != null) dto.setAlunoId(n.getAluno().getId());
        return dto;
    }

    private Nota toEntity(NotaDTO dto) {
        Nota n = new Nota();
        BeanUtils.copyProperties(dto, n);
        if (dto.getTurmaId() != null) {
            Turma t = new Turma(); t.setId(dto.getTurmaId());
            n.setTurma(t);
        }
        if (dto.getAlunoId() != null) {
            Aluno a = new Aluno(); a.setId(dto.getAlunoId());
            n.setAluno(a);
        }
        return n;
    }
}
