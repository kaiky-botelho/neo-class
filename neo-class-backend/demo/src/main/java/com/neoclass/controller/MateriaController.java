package com.neoclass.controller;

import com.neoclass.model.Materia;
import com.neoclass.service.MateriaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/materias")
public class MateriaController {
    private final MateriaService service;
    public MateriaController(MateriaService service) { this.service = service; }

    @GetMapping
    public List<Materia> listar() { return service.listarTodos(); }

    @GetMapping("/{id}")
    public Materia buscar(@PathVariable Long id) { return service.buscarPorId(id); }

    @PostMapping
    public Materia criar(@RequestBody Materia t) { return service.salvar(t); }

    @PutMapping("/{id}")
    public Materia atualizar(@PathVariable Long id, @RequestBody Materia t) {
        t.setId(id);
        return service.salvar(t);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) { service.excluir(id); }
}