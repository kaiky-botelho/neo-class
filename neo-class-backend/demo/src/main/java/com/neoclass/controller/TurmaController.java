package com.neoclass.controller;

import com.neoclass.dto.TurmaDTO;
import com.neoclass.model.Turma;
import com.neoclass.service.TurmaService;
import org.springframework.beans.BeanUtils;
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

    @GetMapping
    public List<TurmaDTO> listar() {
        return service.listarTodos().stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public TurmaDTO buscar(@PathVariable Long id) {
        return toDTO(service.buscarPorId(id));
    }

    @PostMapping
    public TurmaDTO criar(@RequestBody TurmaDTO dto) {
        Turma entidade = toEntity(dto);
        Turma salvo   = service.salvar(entidade);
        return toDTO(salvo);
    }

    @PutMapping("/{id}")
    public TurmaDTO atualizar(@PathVariable Long id, @RequestBody TurmaDTO dto) {
        Turma entidade = toEntity(dto);
        entidade.setId(id);
        Turma salvo   = service.salvar(entidade);
        return toDTO(salvo);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        service.excluir(id);
    }

    // --- helpers de mapeamento ---
    private TurmaDTO toDTO(Turma t) {
        TurmaDTO dto = new TurmaDTO();
        BeanUtils.copyProperties(t, dto);
        return dto;
    }

    private Turma toEntity(TurmaDTO dto) {
        Turma t = new Turma();
        BeanUtils.copyProperties(dto, t);
        return t;
    }
}
