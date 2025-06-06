// src/main/java/com/neoclass/service/TurmaService.java
package com.neoclass.service;

import com.neoclass.model.Turma;
import com.neoclass.repository.TurmaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TurmaService implements CrudService<Turma, Long> {

    private final TurmaRepository repo;

    public TurmaService(TurmaRepository repo) {
        this.repo = repo;
    }

    @Override
    public List<Turma> listarTodos() {
        return repo.findAll();
    }

    @Override
    public Turma buscarPorId(Long id) {
        return repo.findById(id)
                   .orElseThrow(() -> new IllegalArgumentException("Turma não encontrada com id " + id));
    }

    @Override
    public Turma salvar(Turma t) {
        return repo.save(t);
    }

    @Override
    public void excluir(Long id) {
        repo.deleteById(id);
    }
}
