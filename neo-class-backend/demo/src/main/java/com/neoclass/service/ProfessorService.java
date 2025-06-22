// src/main/java/com/neoclass/service/ProfessorService.java
package com.neoclass.service;

import com.neoclass.model.Professor;
import com.neoclass.repository.ProfessorRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProfessorService implements CrudService<Professor, Long> {

    private final ProfessorRepository repo;
    public ProfessorService(ProfessorRepository repo) { this.repo = repo; }

    @Override public List<Professor> listarTodos()           { return repo.findAll(); }
    @Override public Professor buscarPorId(Long id)         { return repo.findById(id).orElseThrow(); }
    @Override public Professor salvar(Professor p)          { return repo.save(p); }
    @Override public void excluir(Long id)                  { repo.deleteById(id); }


    public Optional<Professor> autenticar(String email, String senha) {
        return repo.findByEmailInstitucionalAndSenha(email, senha);
    }
}
