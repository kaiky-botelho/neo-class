package com.neoclass.service;

import com.neoclass.model.Trabalho;
import com.neoclass.repository.TrabalhoRepository;
import org.springframework.stereotype.Service;



import java.util.List;

@Service
public class TrabalhoService implements CrudService<Trabalho, Long> {
    private final TrabalhoRepository repo;
    public TrabalhoService(TrabalhoRepository repo) {
        this.repo = repo;
    }

    @Override
    public List<Trabalho> listarTodos() {
        return repo.findAll();
    }

    @Override
    public Trabalho buscarPorId(Long id) {
        return repo.findById(id).orElseThrow();
    }

    @Override
    public Trabalho salvar(Trabalho t) {
        return repo.save(t);
    }

    @Override
    public void excluir(Long id) {
        repo.deleteById(id);
    }
}
