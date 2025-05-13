package com.neoclass.service;

import com.neoclass.model.Materia;
import com.neoclass.repository.MateriaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MateriaService implements CrudService<Materia, Long> {
    private final MateriaRepository repo;
    public MateriaService(MateriaRepository repo) { this.repo = repo; }

    @Override public List<Materia> listarTodos() { return repo.findAll(); }
    @Override public Materia buscarPorId(Long id) { return repo.findById(id).orElseThrow(); }
    @Override public Materia salvar(Materia t) { return repo.save(t); }
    @Override public void excluir(Long id) { repo.deleteById(id); }
}
