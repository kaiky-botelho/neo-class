package com.neoclass.controller;

import com.neoclass.dto.RespostaDTO;
import com.neoclass.model.Notificacao;
import com.neoclass.model.Secretaria;
import com.neoclass.service.NotificacaoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notificacoes")
public class NotificacaoController {
    private final NotificacaoService service;

    public NotificacaoController(NotificacaoService service) {
        this.service = service;
    }

    @GetMapping
    public List<Notificacao> listar() {
        return service.listarTodos();
    }

    @GetMapping("/pendentes")
    public List<Notificacao> listarPendentes() {
        return service.listarPendentes();
    }

    @GetMapping("/{id}")
    public Notificacao buscar(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    public Notificacao criar(@RequestBody Notificacao n) {
        return service.salvar(n);
    }

    @PutMapping("/{id}/responder")
    public Notificacao responder(
        @PathVariable Long id,
        @RequestBody RespostaDTO payload
    ) {
        // monta a entidade Secretaria apenas com o ID fornecido
        Secretaria secretaria = new Secretaria();
        secretaria.setId(payload.getSecretariaId());

        return service.responder(
            id,
            payload.getResposta(),
            secretaria
        );
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        service.excluir(id);
    }
}
