// src/main/java/com/neoclass/service/MateriaService.java
package com.neoclass.service;

import com.neoclass.model.Materia;
import com.neoclass.repository.MateriaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MateriaService {

    private final MateriaRepository repo;

    public MateriaService(MateriaRepository repo) {
        this.repo = repo;
    }

    // Deve retornar todas as matérias
    public List<Materia> listarTodos() {
        return repo.findAll();
    }

    // Busca uma matéria por ID (lança exceção se não achar)
    public Materia buscarPorId(Long id) {
        return repo.findById(id)
                   .orElseThrow(() -> new IllegalArgumentException("Matéria não encontrada com id " + id));
    }

    // Salva (create ou update) a entidade Materia
    public Materia salvar(Materia m) {
        return repo.save(m);
    }

    // Exclui pelo ID
    public void excluir(Long id) {
        repo.deleteById(id);
    }
}
