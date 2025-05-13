package com.neoclass.service;

import com.neoclass.model.Aluno;
import com.neoclass.repository.AlunoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlunoService implements CrudService<Aluno, Long> {
    private final AlunoRepository repo;
    public AlunoService(AlunoRepository repo) { this.repo = repo; }

    @Override public List<Aluno> listarTodos() { return repo.findAll(); }
    @Override public Aluno buscarPorId(Long id) { return repo.findById(id).orElseThrow(); }
    @Override public Aluno salvar(Aluno t) { return repo.save(t); }
    @Override public void excluir(Long id) { repo.deleteById(id); }
}
