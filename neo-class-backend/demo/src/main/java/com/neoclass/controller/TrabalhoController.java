package com.neoclass.controller;

import com.neoclass.model.Trabalho;
import com.neoclass.service.TrabalhoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trabalhos")
public class TrabalhoController {
    private final TrabalhoService service;
    public TrabalhoController(TrabalhoService service) { this.service = service; }

    @GetMapping
    public List<Trabalho> listar() { return service.listarTodos(); }

    @GetMapping("/{id}")
    public Trabalho buscar(@PathVariable Long id) { return service.buscarPorId(id); }

    @PostMapping
    public Trabalho criar(@RequestBody Trabalho t) { return service.salvar(t); }

    @PutMapping("/{id}")
    public Trabalho atualizar(@PathVariable Long id, @RequestBody Trabalho t) {
        t.setId(id);
        return service.salvar(t);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) { service.excluir(id); }
}

