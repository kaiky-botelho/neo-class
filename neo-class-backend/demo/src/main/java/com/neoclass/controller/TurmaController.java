package com.neoclass.controller;

import com.neoclass.model.Turma;
import com.neoclass.service.TurmaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/turmas")
public class TurmaController {
    private final TurmaService service;
    public TurmaController(TurmaService service) { this.service = service; }

    @GetMapping
    public List<Turma> listar() { return service.listarTodos(); }

    @GetMapping("/{id}")
    public Turma buscar(@PathVariable Long id) { return service.buscarPorId(id); }

    @PostMapping
    public Turma criar(@RequestBody Turma t) { return service.salvar(t); }

    @PutMapping("/{id}")
    public Turma atualizar(@PathVariable Long id, @RequestBody Turma t) {
        t.setId(id);
        return service.salvar(t);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) { service.excluir(id); }
}
