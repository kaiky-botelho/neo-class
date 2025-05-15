// src/main/java/com/neoclass/controller/ProvaController.java
package com.neoclass.controller;

import com.neoclass.dto.ProvaDTO;
import com.neoclass.model.Prova;
import com.neoclass.model.Professor;
import com.neoclass.model.Materia;
import com.neoclass.service.ProvaService;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/provas")
public class ProvaController {
    private final ProvaService service;
    public ProvaController(ProvaService service) { this.service = service; }

    @GetMapping
    public List<ProvaDTO> listar() {
        return service.listarTodos().stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ProvaDTO buscar(@PathVariable Long id) {
        return toDTO(service.buscarPorId(id));
    }

    @PostMapping
    public ProvaDTO criar(@RequestBody ProvaDTO dto) {
        Prova entidade = toEntity(dto);
        Prova salvo   = service.salvar(entidade);
        return toDTO(salvo);
    }

    @PutMapping("/{id}")
    public ProvaDTO atualizar(@PathVariable Long id, @RequestBody ProvaDTO dto) {
        Prova entidade = toEntity(dto);
        entidade.setId(id);
        return toDTO(service.salvar(entidade));
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        service.excluir(id);
    }

    private ProvaDTO toDTO(Prova p) {
        ProvaDTO dto = new ProvaDTO();
        BeanUtils.copyProperties(p, dto);
        if (p.getProfessor() != null) dto.setProfessorId(p.getProfessor().getId());
        if (p.getMateria()   != null) dto.setMateriaId(p.getMateria().getId());
        return dto;
    }

    private Prova toEntity(ProvaDTO dto) {
        Prova p = new Prova();
        BeanUtils.copyProperties(dto, p);
        if (dto.getProfessorId() != null) {
            Professor prof = new Professor(); prof.setId(dto.getProfessorId());
            p.setProfessor(prof);
        }
        if (dto.getMateriaId() != null) {
            Materia m = new Materia(); m.setId(dto.getMateriaId());
            p.setMateria(m);
        }
        return p;
    }
}
