package com.neoclass.service;

import com.neoclass.model.Notificacao;
import com.neoclass.model.Secretaria;
import com.neoclass.repository.NotificacaoRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificacaoService implements CrudService<Notificacao, Long> {
    private final NotificacaoRepository repo;

    public NotificacaoService(NotificacaoRepository repo) {
        this.repo = repo;
    }

    @Override
    public List<Notificacao> listarTodos() {
        return repo.findAll();
    }

    public List<Notificacao> listarPendentes() {
        return repo.findByStatus("PENDENTE");
    }

    @Override
    public Notificacao buscarPorId(Long id) {
        return repo.findById(id).orElseThrow();
    }

    @Override
    public Notificacao salvar(Notificacao n) {
        return repo.save(n);
    }

    @Override
    public void excluir(Long id) {
        repo.deleteById(id);
    }

    public Notificacao responder(Long id, String resposta, Secretaria secretaria) {
        Notificacao n = buscarPorId(id);
        n.setResposta(resposta);
        n.setDataResposta(LocalDateTime.now());
        n.setSecretaria(secretaria);
        n.setStatus("RESPONDIDA");
        return repo.save(n);
    }
}
