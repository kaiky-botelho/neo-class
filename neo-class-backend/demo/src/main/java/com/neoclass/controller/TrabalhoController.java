// src/main/java/com/neoclass/controller/TrabalhoController.java
package com.neoclass.controller;

import com.neoclass.dto.TrabalhoDTO;
import com.neoclass.model.Trabalho;
import com.neoclass.model.Professor;
import com.neoclass.service.TrabalhoService;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/trabalhos")
public class TrabalhoController {
    private final TrabalhoService service;
    public TrabalhoController(TrabalhoService service) { this.service = service; }

    @GetMapping
    public List<TrabalhoDTO> listar() {
        return service.listarTodos().stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public TrabalhoDTO buscar(@PathVariable Long id) {
        return toDTO(service.buscarPorId(id));
    }

    @PostMapping
    public TrabalhoDTO criar(@RequestBody TrabalhoDTO dto) {
        Trabalho entidade = toEntity(dto);
        Trabalho salvo   = service.salvar(entidade);
        return toDTO(salvo);
    }

    @PutMapping("/{id}")
    public TrabalhoDTO atualizar(@PathVariable Long id, @RequestBody TrabalhoDTO dto) {
        Trabalho entidade = toEntity(dto);
        entidade.setId(id);
        return toDTO(service.salvar(entidade));
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        service.excluir(id);
    }

    private TrabalhoDTO toDTO(Trabalho t) {
        TrabalhoDTO dto = new TrabalhoDTO();
        BeanUtils.copyProperties(t, dto);
        if (t.getProfessor() != null) dto.setProfessorId(t.getProfessor().getId());
        return dto;
    }

    private Trabalho toEntity(TrabalhoDTO dto) {
        Trabalho t = new Trabalho();
        BeanUtils.copyProperties(dto, t);
        if (dto.getProfessorId() != null) {
            Professor p = new Professor(); p.setId(dto.getProfessorId());
            t.setProfessor(p);
        }
        return t;
    }
}
