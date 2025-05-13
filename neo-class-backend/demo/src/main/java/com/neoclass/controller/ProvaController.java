package com.neoclass.controller;

import com.neoclass.model.Prova;
import com.neoclass.service.ProvaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/provas")
public class ProvaController {
    private final ProvaService service;
    public ProvaController(ProvaService service) { this.service = service; }

    @GetMapping
    public List<Prova> listar() { return service.listarTodos(); }

    @GetMapping("/{id}")
    public Prova buscar(@PathVariable Long id) { return service.buscarPorId(id); }

    @PostMapping
    public Prova criar(@RequestBody Prova t) { return service.salvar(t); }

    @PutMapping("/{id}")
    public Prova atualizar(@PathVariable Long id, @RequestBody Prova t) {
        t.setId(id);
        return service.salvar(t);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) { service.excluir(id); }
}

