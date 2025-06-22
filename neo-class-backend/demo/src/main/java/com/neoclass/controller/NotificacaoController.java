package com.neoclass.controller;

import com.neoclass.dto.NotificacaoDTO;
import com.neoclass.dto.RespostaDTO;
import com.neoclass.model.Aluno;
import com.neoclass.model.Notificacao;
import com.neoclass.model.Secretaria;
import com.neoclass.service.NotificacaoService;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.time.Instant; 

@RestController
@RequestMapping("/api/notificacoes")
public class NotificacaoController {
    private final NotificacaoService service;

    public NotificacaoController(NotificacaoService service) {
        this.service = service;
    }

    @GetMapping
    public List<NotificacaoDTO> listar() {
        return service.listarTodos()
                      .stream()
                      .map(this::toDTO)
                      .toList();
    }

    @GetMapping("/pendentes")
    public List<NotificacaoDTO> listarPendentes() {
        return service.listarPendentes()
                      .stream()
                      .map(this::toDTO)
                      .toList();
    }

    @GetMapping("/{id}")
    public NotificacaoDTO buscar(@PathVariable Long id) {
        return toDTO(service.buscarPorId(id));
    }

    @PostMapping
    public NotificacaoDTO criar(@RequestBody NotificacaoDTO dto) {
        Notificacao n = new Notificacao();
        BeanUtils.copyProperties(dto, n, "id", "aluno", "secretaria");
        
        Aluno a = new Aluno();
        a.setId(dto.getAlunoId());
        n.setAluno(a);

        Notificacao salvo = service.salvar(n);
        return toDTO(salvo);
    }

    @PutMapping("/{id}/responder")
    public NotificacaoDTO responder(
        @PathVariable Long id,
        @RequestBody RespostaDTO payload
    ) {
        Secretaria sec = new Secretaria();
        sec.setId(payload.getSecretariaId());
        Notificacao atualizado = service.responder(id, payload.getResposta(), sec);
        return toDTO(atualizado);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        service.excluir(id);
    }

    private NotificacaoDTO toDTO(Notificacao n) {
        NotificacaoDTO dto = new NotificacaoDTO();
        BeanUtils.copyProperties(n, dto);
        dto.setAlunoId(n.getAluno().getId());
        if (n.getSecretaria() != null) {
            dto.setSecretariaId(n.getSecretaria().getId());
        }
        return dto;
    }
}