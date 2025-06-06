// src/main/java/com/neoclass/controller/TurmaController.java
package com.neoclass.controller;

import com.neoclass.dto.TurmaDTO;
import com.neoclass.model.Turma;
import com.neoclass.service.TurmaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/turmas")
public class TurmaController {

    private final TurmaService service;

    public TurmaController(TurmaService service) {
        this.service = service;
    }

    // Converte entidade Turma → TurmaDTO
    private TurmaDTO toDTO(Turma t) {
        TurmaDTO dto = new TurmaDTO();
        dto.setId(t.getId());
        dto.setNome(t.getNome());
        dto.setAnoLetivo(t.getAnoLetivo());
        dto.setSerie(t.getSerie());
        dto.setTurno(t.getTurno());
        dto.setSala(t.getSala());
        return dto;
    }

    // Converte DTO → entidade Turma
    private Turma toEntity(TurmaDTO dto) {
        Turma t = new Turma();
        t.setId(dto.getId());               // Se id == null, o JPA entende como INSERT; se não, UPDATE
        t.setNome(dto.getNome());
        t.setAnoLetivo(dto.getAnoLetivo());
        t.setSerie(dto.getSerie());
        t.setTurno(dto.getTurno());
        t.setSala(dto.getSala());
        return t;
    }

    @GetMapping
    public ResponseEntity<List<TurmaDTO>> listarTodas() {
        List<Turma> lista = service.listarTodos();
        List<TurmaDTO> dtos = lista.stream()
                                   .map(this::toDTO)
                                   .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TurmaDTO> buscarPorId(@PathVariable Long id) {
        Turma t = service.buscarPorId(id);
        return ResponseEntity.ok(toDTO(t));
    }

    @PostMapping
    public ResponseEntity<TurmaDTO> criar(@RequestBody TurmaDTO dto) {
        Turma entidade = toEntity(dto);      // dto.getId() geralmente = null aqui
        Turma salva = service.salvar(entidade);
        return ResponseEntity.status(201).body(toDTO(salva));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TurmaDTO> atualizar(
            @PathVariable Long id,
            @RequestBody TurmaDTO dto
    ) {
        dto.setId(id);
        Turma entidade = toEntity(dto);
        Turma atualizada = service.salvar(entidade);
        return ResponseEntity.ok(toDTO(atualizada));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
