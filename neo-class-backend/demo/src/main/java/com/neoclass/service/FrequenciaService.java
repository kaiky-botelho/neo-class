// src/main/java/com/neoclass/service/FrequenciaService.java
package com.neoclass.service;

import com.neoclass.model.Frequencia;
import com.neoclass.repository.FrequenciaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FrequenciaService implements CrudService<Frequencia, Long> {
    private final FrequenciaRepository repo;
    public FrequenciaService(FrequenciaRepository repo) {
        this.repo = repo;
    }

    @Override
    public List<Frequencia> listarTodos() {
        return repo.findAll();
    }

    @Override
    public Frequencia buscarPorId(Long id) {
        return repo.findById(id).orElseThrow();
    }

    @Override
    public Frequencia salvar(Frequencia f) {
        return repo.save(f);
    }

    @Override
    public void excluir(Long id) {
        repo.deleteById(id);
    }
}
