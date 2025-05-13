package com.neoclass.controller;

import com.neoclass.model.Nota;
import com.neoclass.service.NotaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notas")
public class NotaController {
    private final NotaService service;
    public NotaController(NotaService service) { this.service = service; }

    @GetMapping
    public List<Nota> listar() { return service.listarTodos(); }

    @GetMapping("/{id}")
    public Nota buscar(@PathVariable Long id) { return service.buscarPorId(id); }

    @PostMapping
    public Nota criar(@RequestBody Nota t) { return service.salvar(t); }

    @PutMapping("/{id}")
    public Nota atualizar(@PathVariable Long id, @RequestBody Nota t) {
        t.setId(id);
        return service.salvar(t);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) { service.excluir(id); }
}

