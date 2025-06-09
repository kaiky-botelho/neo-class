package com.neoclass.service;

import com.neoclass.model.Notificacao;
import com.neoclass.model.Secretaria;
import com.neoclass.repository.NotificacaoRepository;
import org.springframework.stereotype.Service;
import java.time.Instant; // MUITO IMPORTANTE: Importar Instant
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
        // Se dataEnvio não for setado no DTO, o modelo tem um default Instant.now()
        // O BeanUtils.copyProperties no controller irá setar dataEnvio vindo do DTO.
        return repo.save(n);
    }

    @Override
    public void excluir(Long id) {
        repo.deleteById(id);
    }

    public Notificacao responder(Long id, String resposta, Secretaria secretaria) {
        Notificacao n = buscarPorId(id);
        n.setResposta(resposta);
        n.setDataResposta(Instant.now()); // MUDANÇA AQUI: Usar Instant.now()
        n.setSecretaria(secretaria);
        n.setStatus("RESPONDIDA");
        return repo.save(n);
    }
}