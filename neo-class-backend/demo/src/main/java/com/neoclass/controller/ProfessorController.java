package com.neoclass.controller;

import com.neoclass.model.Professor;
import com.neoclass.service.ProfessorService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/professores")
public class ProfessorController {
    private final ProfessorService service;
    public ProfessorController(ProfessorService service) { this.service = service; }

    @GetMapping
    public List<Professor> listar() { return service.listarTodos(); }

    @GetMapping("/{id}")
    public Professor buscar(@PathVariable Long id) { return service.buscarPorId(id); }

    @PostMapping
    public Professor criar(@RequestBody Professor t) { return service.salvar(t); }

    @PutMapping("/{id}")
    public Professor atualizar(@PathVariable Long id, @RequestBody Professor t) {
        t.setId(id);
        return service.salvar(t);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) { service.excluir(id); }
}

