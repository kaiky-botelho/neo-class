package com.neoclass.service;

import com.neoclass.model.Professor;
import com.neoclass.repository.ProfessorRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProfessorService implements CrudService<Professor, Long> {
    private final ProfessorRepository repo;
    public ProfessorService(ProfessorRepository repo) { this.repo = repo; }

    @Override public List<Professor> listarTodos() { return repo.findAll(); }
    @Override public Professor buscarPorId(Long id) { return repo.findById(id).orElseThrow(); }
    @Override public Professor salvar(Professor t) { return repo.save(t); }
    @Override public void excluir(Long id) { repo.deleteById(id); }
}
