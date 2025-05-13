package com.neoclass.controller;

import com.neoclass.model.Notificacao;
import com.neoclass.service.NotificacaoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notificacoes")
public class NotificacaoController {
    private final NotificacaoService service;
    public NotificacaoController(NotificacaoService service) { this.service = service; }

    @GetMapping
    public List<Notificacao> listar() { return service.listarTodos(); }

    @GetMapping("/{id}")
    public Notificacao buscar(@PathVariable Long id) { return service.buscarPorId(id); }

    @PostMapping
    public Notificacao criar(@RequestBody Notificacao t) { return service.salvar(t); }

    @PutMapping("/{id}")
    public Notificacao atualizar(@PathVariable Long id, @RequestBody Notificacao t) {
        t.setId(id);
        return service.salvar(t);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) { service.excluir(id); }
}

