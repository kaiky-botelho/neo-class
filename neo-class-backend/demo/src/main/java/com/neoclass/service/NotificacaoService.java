package com.neoclass.service;

import com.neoclass.model.Notificacao;
import com.neoclass.repository.NotificacaoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificacaoService implements CrudService<Notificacao, Long> {
    private final NotificacaoRepository repo;
    public NotificacaoService(NotificacaoRepository repo) { this.repo = repo; }

    @Override public List<Notificacao> listarTodos() { return repo.findAll(); }
    @Override public Notificacao buscarPorId(Long id) { return repo.findById(id).orElseThrow(); }
    @Override public Notificacao salvar(Notificacao t) { return repo.save(t); }
    @Override public void excluir(Long id) { repo.deleteById(id); }
}
