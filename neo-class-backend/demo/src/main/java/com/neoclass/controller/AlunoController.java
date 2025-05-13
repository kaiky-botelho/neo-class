package com.neoclass.controller;

import com.neoclass.model.Aluno;
import com.neoclass.service.AlunoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alunos")
public class AlunoController {
    private final AlunoService service;
    public AlunoController(AlunoService service) { this.service = service; }

    @GetMapping
    public List<Aluno> listar() { return service.listarTodos(); }

    @GetMapping("/{id}")
    public Aluno buscar(@PathVariable Long id) { return service.buscarPorId(id); }

    @PostMapping
    public Aluno criar(@RequestBody Aluno t) { return service.salvar(t); }

    @PutMapping("/{id}")
    public Aluno atualizar(@PathVariable Long id, @RequestBody Aluno t) {
        t.setId(id);
        return service.salvar(t);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) { service.excluir(id); }
}
